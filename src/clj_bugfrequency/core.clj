(ns clj-bugfrequency.core
  (:use compojure.core)
  (:use ring.middleware.json)
  (:use ring.util.codec)
  (:require [compojure.core :refer :all]
            [cheshire.core :refer :all]
            [compojure.route :as route]
            [clojure.string :refer [join]]
            [compojure.handler :as handler]
            [org.httpkit.client :as http]
            [clojure.core.memoize :as memo]))

(defn read-config
  []
  (parse-string (slurp "config.json") true))

(def get-config (memo/ttl read-config :ttl/threshold 86400))

(defn reload-config
  []
  (memo/memo-clear! get-config))

(defn get-jira-url
  [jql]
  (let [config (:jira (get-config))]
    (str (:url config) "search?jql=" (url-encode jql) "&fields=key&maxResults=" (:maxResults config))))

(defn get-stash-url
  [task]
  (let [config (:stash (get-config))]
    (str (:url config) task "/commits?maxChanges=" (:maxChanges config))))

(defn doreq
  [user pw url]
  @(http/get url {:as :text :basic-auth [user pw]}))

(defn format-req
  [json]
  (parse-string (:body json) true))

(defn to-issue-keys
  [issue]
  (:key issue))

; {:issues [{:key "123"} {:key "234"}]} -> ["123" "234"]
(defn fetch-tasks
  [jql]
  (let [{user :user pw :pw} (:jira (get-config))]
    (map to-issue-keys (:issues (format-req (doreq user pw (get-jira-url jql)))))))

; collects all filepaths from all commits
; {:values [{:changes {:values [{:path {:toString "/path/to/file"}}]}}] -> ["/path/to/file"]
(defn to-file-list
  [changeset]
  (mapcat 
    (fn [value]
      (map (fn [changevalue]
             (get-in changevalue [:path :toString]))
           (get-in value [:changes :values])))
    (:values changeset)))

(defn fetch-changesets
  [task]
  (let [{user :user pw :pw} (:stash (get-config))]
    (distinct (to-file-list (format-req (doreq user pw (get-stash-url task)))))))

(def fetch-changesets-cached (memo/ttl fetch-changesets :ttl/threshold (:ttl (:cache (get-config)))))

; [:task1 :task2] -> {:task ["file1" "file2"]
(defn aggregate-data
  [tasks]
  (pmap (fn [task] {(keyword task) (fetch-changesets-cached task)}) tasks))

; {:task ["file1" "file2"]} -> {"file1" [:task] "file2" [:task]}
(defn to-file-occurence
  [aggregated]
  (reduce (fn [res item]
            (let [k (first (keys item))]
              (merge-with 
                (comp distinct concat) res
                (reduce 
                  (fn [files file]
                    (assoc files file (conj (get files file) k))) {} (k item)))))
          {} aggregated))

(defn sort-by-tasknumber
  [occurence-map]
  (into (sorted-map-by 
          (fn [key1 key2]
            (compare
              [(count (get occurence-map key2)) key2] 
              [(count (get occurence-map key1)) key1])))
        occurence-map))

(defn get-initial-data
  []
  (let [{user :user pw :pw url :url} (:jira (get-config))]
    {:jira {:projects (map (fn [project] (:key project)) (format-req (doreq user pw (str url "project"))))
            :taskTypes (map (fn [project] (:name project)) (format-req (doreq user pw (str url "issuetype"))))
            :taskStatus (map (fn [project] (:name project)) (format-req (doreq user pw (str url "status"))))
            }}))

(def get-initial-data-cached (memo/ttl get-initial-data :ttl/threshold (:ttl (:cache (get-config)))))

(defn evict-task
  [task]
  (memo/memo-clear! fetch-changesets-cached [task]))

(defn evict-all
  []
  (memo/memo-clear! get-config)
  (memo/memo-clear! get-initial-data-cached)
  (memo/memo-clear! fetch-changesets-cached))

(defn build-jql
  [projects issuetypes statuses datefrom dateto]
  (str "project in (" (join "," projects) 
       ") AND type in (" (join "," issuetypes) 
       ") AND status in (" (join "," statuses) 
       ") AND created > " datefrom 
       " AND created < " dateto))

(defn fetch-by-jql
  [jql]
  (sort-by-tasknumber (to-file-occurence (aggregate-data (fetch-tasks jql)))))

; routes
(defroutes app-routes
  (GET "/" [] {:body (slurp "index.html")})
  (GET "/config" [] {:body (get-config)})
  (GET "/config/reload" [] {:body (reload-config)})
  (GET "/cache/evict/:task" [task] {:body (evict-task task)})
  (GET "/cache/evict/all" [] {:body (evict-all)})
  (GET "/cache" [] {:body (memo/snapshot fetch-changesets-cached)})
  (GET "/initialData" [] {:body (get-initial-data-cached)})
  (GET "/fetch" req {:body (fetch-by-jql (:jql (:params req)))})
  (GET "/fetchp" req {:body 
                      (let [{:keys [projects issuetypes statuses datefrom dateto]} (:params req)]
                        (fetch-by-jql (build-jql projects issuetypes statuses datefrom dateto)))})
  (route/not-found {:body {:error 404}}))

(defn wrap-error-handling [f]
  (fn [req]
    (try (f req)
         (catch Exception e
           {:status 500
            :body {:error (str e)}}))))

(def app
  (-> app-routes
      (wrap-error-handling)
      (ring.middleware.json/wrap-json-response)
      (handler/api)))

