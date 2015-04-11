'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const JqlForm = require('../components/JqlForm').JqlForm;
const TestUtils = require('react-addons-test-utils');

describe('JqlForm', () => {
    it('shows a form and fetches on submit', () => {
        const fields = {
            jql: {
                error: false
            }
        };
        const res = TestUtils.renderIntoDocument(<JqlForm fields={fields}/>);
        const row = TestUtils.findRenderedDOMComponentWithClass(res, 'row');
        expect(row).not.to.equal(undefined);
    });

    it('does nothing if jql is empty', () => {
        const fields = {
            jql: {
                error: false
            }
        };
        const res = TestUtils.renderIntoDocument(<JqlForm fields={fields}/>);
        const button = TestUtils.findRenderedDOMComponentWithClass(res, 'button');
        TestUtils.Simulate.click(ReactDOM.findDOMNode(button));
    });
});
