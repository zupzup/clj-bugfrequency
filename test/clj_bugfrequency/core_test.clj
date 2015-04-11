(ns clj-bugfrequency.core-test
  (:use midje.sweet)
  (:require [clj-bugfrequency.core :as core]
            [org.httpkit.client :as http]))

(fact "`format-req` creates a keyword map from the json body of a response"
      (core/format-req {:body "{\"yay\": 5}"}) => {:yay 5})

(fact "`read-config` reads config from config.json"
      (core/read-config) => truthy)

(fact "`to-issue-keys` gets the keys from an issues"
      (core/to-issue-keys {:key "taskKey" :name "taskName"}) => "taskKey")

(fact "`get-stash-url` returns the query url for querying stash"
      (core/get-stash-url "taskKey") => "http://www.example.com/taskKey/commits?maxChanges=10"
      (provided
        (core/get-config) => {:stash {:url "http://www.example.com/" :maxChanges 10}}))

(fact "`get-jira-url` returns the query url for querying jira"
      (core/get-jira-url "someJql") => "http://www.example.com/search?jql=someJql&fields=key&maxResults=10"
      (provided
        (core/get-config) => {:jira {:url "http://www.example.com/" :maxResults 10}}))

(fact "`to-file-list` transforms changesets to a list of changed files"
      (core/to-file-list 
        {:values [{:changes {:values [{:path {:toString "file1"}} {:path {:toString "file2"}}]}}]}
        ) => ["file1" "file2"])

(fact "`to-file-occurence` transforms a list of task -> [files] to file -> [tasks]"
      (core/to-file-occurence
        [{:task1 ["file1" "file2"]} {:task2 ["file2"]}]
        ) => {"file1" [:task1] "file2" [:task1 :task2]})

(fact "`sort-by-tasknumber` sorts the aggregated list by the number of tasks it includes"
      (core/sort-by-tasknumber {"file1" [:task1] "file2" [:task1 :task2]})
      => {"file2" [:task1 :task2] "file1" [:task1]})

(fact "`build-jql` builds a jql query from all jira inputs"
      (core/build-jql ["XLM"] ["Bug"] ["Done"] "from" "to")
      => "project in (XLM) AND type in (Bug) AND status in (Done) AND created > from AND created < to")

(fact "`fetch-tasks` fetches all tasks based on the given jql"
      (core/fetch-tasks "jql") => ["task1"]
      (provided 
        (core/get-config) => {:jira {:user "user" :pw "pw" :url "url/"}},
        (core/doreq "user" "pw" "url/search?jql=jql&fields=key&maxResults=") => {:body "{\"issues\": [{\"key\": \"task1\"}]}"}))

(fact "`wrap-error-handling` returns a 500 error with the exception in the json if there was an error"
      (let [f (fn [req] (throw (NullPointerException.)))]
        ((core/wrap-error-handling f) {}) => {:status 500 :body {:error "java.lang.NullPointerException"}}))

