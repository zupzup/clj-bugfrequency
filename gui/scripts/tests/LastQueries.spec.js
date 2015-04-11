'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const LastQueries = require('../components/LastQueries');
const TestUtils = require('react-addons-test-utils');
const mori = require('mori');

describe('LastQueries', () => {
    it('shows no history data, if there isnt any', () => {
        const res = TestUtils.renderIntoDocument(<LastQueries />);
        expect(ReactDOM.findDOMNode(res).textContent).to.equal('No History Data');
    });

    it('shows history data', () => {
        const data = mori.toClj([0, 1, 2]);
        const res = TestUtils.renderIntoDocument(<LastQueries data={data} />);
        expect(ReactDOM.findDOMNode(res).textContent).to.contain('Last 10 Queries');
        expect(ReactDOM.findDOMNode(res).textContent).to.contain('latest');
        expect(ReactDOM.findDOMNode(res).textContent).to.contain('1');
    });

    it('calls the given handler, when clicking on a history item', () => {
        const handlerSpy = sinon.spy();
        const data = mori.toClj([0, 1, 2]);
        const res = TestUtils.renderIntoDocument(<LastQueries data={data} handler={handlerSpy} />);
        const second = TestUtils.scryRenderedDOMComponentsWithClass(res, 'button small');
        TestUtils.Simulate.click(ReactDOM.findDOMNode(second[0]));
        expect(ReactDOM.findDOMNode(res).textContent).to.contain('Last 10 Queries');
        expect(handlerSpy.calledOnce).to.equal(true);
    });
});
