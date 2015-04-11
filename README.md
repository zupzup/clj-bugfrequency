# clj-bugfrequency

A service for finding the files responsible for most bugs using Atlassian's JIRA and Stash API.

## Usage

    $ java -jar clj-bugfrequency-0.1.0-standalone.jar [args]

## Config

* config.json

## TODO

* favicon
* gui
    * update to react 0.14
    * make flow work with es6 classes
    * api-connection
        * cache
        * initial data
        * fetchData

## DONE

* [x] basic http server
    * [x] return fake json
* [x] create config
    * [x] jira server
    * [x] stash server
* [x] http call
* [x] Stash
    * [x] get commits
    * [x] filter files (unique for each changeset)
    * [x] sort results
* [x] Caching
    * [x] cache commits for issues in memory
    * [x] memoize-ttl for fetch-changesets
* [x] URL-creation
    * [x] jql
    * [x] taskname
* [x] Use real URL's
    * [x] maybe url-encode (ring-codec)
* [x] Cache Routes
    * [x] Cache Deletion
* [x] Cache-evict-all evict ALL (config, initial data, tasks)
* [x] Get Initial Data from Jira
    * [x] Tasktypes, Projects, Statuses
    * [x] Cache
    * [x] rest/api/latest/status
    * [x] rest/api/latest/issuetype
    * [x] rest/api/latest/project
* [x] Route for searching for project, tasktypes, projects, statuses, datefrom, dateto
* [x] include test framework
    * [x] write some tests
* [x] include coverage
* [x] Error-Handling for HTTP-Requests
    * [x] route error handling (http://stackoverflow.com/questions/12627410/idiomatic-way-to-catch-exceptions-in-ring-apps, https://mmcgrana.github.io/2010/08/clojure-rest-api.html)
* [x] add subproject for cljs
* [x] react project (/gui)
    * [x] get react dummy (om, reagent etc.) up & running
    * [x] libs
        * [x] mori
        * [x] http abstraction (superagent) + promise abstraction (bluebird?)
    * [x] tests (karma)
        * [x] webpack
        * [x] test coverage 
* [x] add foundation (css)
* [x] https://github.com/JedWatson/react-select
* [x] https://github.com/Hacker0x01/react-datepicker
* [x] data-store with mori
* [x] top-menu, accordion or smth
    * [x] query, filters, history, cache
* [x] last x queries
* [x] proptypes
* [x] widgets (filter / searchable)
    * [x] filelist
    * [x] piechart https://github.com/codesuki/react-d3-components
* [x] filter/sort/graph (foundation sub-nav)
    * [x] file extensions
    * [x] fuzzy search
* [x] flow (http://www.keendevelopment.ch/flow-babel-gulp-es6/)
* [x] flow annotations
* [x] coverage without sourcemaps (https://github.com/deepsweet/isparta-loader)
* [x] tests
* [x] move to es6 classes
* [x] test all the things

