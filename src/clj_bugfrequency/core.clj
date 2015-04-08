(ns clj-bugfrequency.core
  (:use compojure.core)
  (:use ring.middleware.json)
  (:require [compojure.core :refer :all]
            [cheshire.core :refer :all]
            [compojure.route :as route]
            [org.httpkit.client :as http]))

(defn get-config
  []
  (parse-string (slurp "config.json")))

(defn somereq
  [user pw url]
  @(http/get url {:as :text :basic-auth [user pw]}))

(defn format-req
  [json]
  (:values (parse-string (:body (somereq)) true)))

(defroutes app-routes
  (GET "/" [] {:body {:karr "hello"}})
  (GET "/config" [] {:body (get-config)})
  (GET "/req" [] {:body (format-req (somereq))})
  (route/not-found {:body {:error 404}}))

(def app
  (-> app-routes
      (ring.middleware.json/wrap-json-response)))

