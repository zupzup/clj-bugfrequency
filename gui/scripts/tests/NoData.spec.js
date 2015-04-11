'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const NoData = require('../components/NoData');
const TestUtils = require('react-addons-test-utils');

describe('NoData', () => {
    it('shows no data', () => {
        const res = TestUtils.renderIntoDocument(<NoData />);
        expect(res).not.to.equal(undefined);
        expect(ReactDOM.findDOMNode(res).textContent).to.equal('No Data');
    });
});
