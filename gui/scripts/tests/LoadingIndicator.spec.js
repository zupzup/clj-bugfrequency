const React = require('react');
const LoadingIndicator = require('../components/LoadingIndicator');
const TestUtils = require('react-addons-test-utils');

describe('LoadingIndicator', () => {
    it('shows two dots', () => {
        const res = TestUtils.renderIntoDocument(<LoadingIndicator />);
        const dot1 = TestUtils.findRenderedDOMComponentWithClass(res, 'dot1');
        const dot2 = TestUtils.findRenderedDOMComponentWithClass(res, 'dot2');
        expect(dot1).to.not.equal(undefined);
        expect(dot2).to.not.equal(undefined);
    });
});
