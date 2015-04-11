const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./App').default;
const GetInitialDataAction = require('./actions/GetInitialDataAction');
const redux = require('redux');
const compose = redux.compose;
const reduxDevtools = require('redux-devtools');
const devTools = reduxDevtools.devTools;
const devComps = require('redux-devtools/lib/react');
const DebugPanel = devComps.DebugPanel;
const DevTools = devComps.DevTools;
const LogMonitor = devComps.LogMonitor;
const persistState = reduxDevtools.persistState;
const Provider = require('react-redux').Provider;
const createStore = redux.createStore;
const reducers = require('./stores/reducers');
const applyMiddleware = redux.applyMiddleware;
const thunk = require('redux-thunk');
const finalCreateStore = compose(
    applyMiddleware(thunk),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);
const store = finalCreateStore(reducers);

window.store = store;

store.dispatch(GetInitialDataAction());
ReactDOM.render(
    <div>
        <Provider store={store}>
            <App/>
        </Provider>
        <DebugPanel top right bottom>
            <DevTools store={store} monitor={LogMonitor} visibleOnLoad={false} />
        </DebugPanel>
    </div>, document.getElementById('app'));

