(defproject clj-bugfrequency "0.1.0-SNAPSHOT"
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [ring "1.3.2"]
                 [ring/ring-json "0.3.1"]
                 [compojure "1.3.3"]
                 [cheshire "5.4.0"]
                 [http-kit "2.1.18"]]
  :plugins [[lein-ring "0.9.3"]]
  :ring {:handler clj-bugfrequency.core/app}
  :main ^:skip-aot clj-bugfrequency.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}})
