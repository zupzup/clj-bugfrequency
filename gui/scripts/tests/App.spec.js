const React = require('react');
const App = require('../App').App;
const mori = require('mori');
const Provider = require('react-redux').Provider;
const reducers = require('../stores/reducers');
const redux = require('redux');
const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;
const thunk = require('redux-thunk');
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const TestUtils = require('react-addons-test-utils'),
    shallowRenderer = TestUtils.createRenderer();

describe('App', () => {
    let dispatchSpy;

    beforeEach(() => {
        dispatchSpy = sinon.spy();
    });

    it('gets rendered successfully', () => {
        shallowRenderer.render(<App dispatch={dispatchSpy} />);
        const result = shallowRenderer.getRenderOutput();
        expect(result.type).to.equal('div');
    });

    it('gets rendered successfully', () => {
        const result = TestUtils.renderIntoDocument(
            <Provider store={stores}>
                <App dispatch={dispatchSpy} />
            </Provider>
        );
        const appDiv = TestUtils.findRenderedDOMComponentWithClass(result, 'app');
        expect(appDiv).not.to.equal(undefined);
    });

    describe('_getNav', () => {
        it('gets nav items', () => {
            const result = TestUtils.renderIntoDocument(
                <Provider store={stores}>
                    <App dispatch={dispatchSpy} />
                </Provider>
            );
            const res = result._getNav();
            expect(res.length).to.equal(3);
        });
    });

    describe('_filterFiles', () => {
        it('uses current data, if there are no files', () => {
            const result = TestUtils.renderIntoDocument(
                <Provider store={stores}>
                    <App dispatch={dispatchSpy} />
                </Provider>
            );
            sinon.stub(result, 'setState');
            result._filterFiles();
            expect(result.setState.calledOnce).to.equal(true);
            result.setState.restore();
        });

        it('returns filtered files', () => {
            const result = TestUtils.renderIntoDocument(
                <Provider store={stores}>
                    <App dispatch={dispatchSpy} />
                </Provider>
            );
            result.state.currentData = mori.toClj([
                [
                    "task1",
                    "file1"
                ]
            ]);
            const filtered = result._filterFiles(mori.toClj([
                "file1",
                "file2"
            ]));
            expect(mori.toJs(filtered).length).to.equal(0);
        });
    });

    describe('_getToggleFunc', () => {
        it('gets the function for the given menupoint', () => {
            const result = TestUtils.renderIntoDocument(
                <Provider store={stores}>
                    <App dispatch={dispatchSpy} />
                </Provider>
            );
            const result = TestUtils.renderIntoDocument(<App dispatch={dispatchSpy} />);
            sinon.stub(result, 'setState');
            result._getToggleFunc('showHistory')({preventDefault: () => {}});
            expect(result.setState.calledOnce).to.equal(true);
            result.setState.restore();
        });
    });

    describe('_getCacheFunc', () => {
        it('gets the function for the cache menupoint', () => {
            const result = TestUtils.renderIntoDocument(
                <Provider store={stores}>
                    <App dispatch={dispatchSpy} />
                </Provider>
            );
            sinon.stub(result, 'setState');
            result._getCacheFunc();
            expect(result.setState.calledOnce).to.equal(true);
            result.setState.restore();
        });

        it('calls fetchmenuaction of cache isnt shown', () => {
            const result = TestUtils.renderIntoDocument(
                <Provider store={stores}>
                    <App dispatch={dispatchSpy} />
                </Provider>
            );
            result.state.showCache = false;
            result._getCacheFunc();
            expect(dispatchSpy.callCount).to.equal(1);
        });
    });
});

