'use strict';

const React = require('react');
const QueryForm = require('../components/QueryForm');
const TestUtils = require('react-addons-test-utils');
const mori = require('mori');

describe('QueryForm', () => {
    let dispatchSpy;
    beforeEach(() => {
        dispatchSpy = sinon.spy();
    });

    it('renders a form', () => {
        const res = TestUtils.renderIntoDocument(<QueryForm dispatch={dispatchSpy} />);
        expect(Object.keys(res.refs).length).to.equal(3);
    });

    it('fetches data with the given values', () => {
        const res = TestUtils.renderIntoDocument(<QueryForm dispatch={dispatchSpy} />);
        res._handleQueriesSubmit();
        expect(dispatchSpy.calledOnce).to.equal(true);
    });

    it('gets the values for the select fields', () => {
        const res = TestUtils.renderIntoDocument(<QueryForm dispatch={dispatchSpy} initialData={mori.toClj({
            projects: ['yay', 'yoy']
        })} />);
        const results = res._getSelectValues('projects');
        expect(results.length).to.equal(2);
    });

    it('sets the state for events handlers', () => {
        const res = TestUtils.renderIntoDocument(<QueryForm dispatch={dispatchSpy} />);
        res.setState = sinon.spy();
        res._handleProjectsChange();
        res._handleIssueTypesChange();
        res._handleIssueStatusChange();
        res._onFromDateChange();
        res._onToDateChange();
        expect(res.setState.callCount).to.equal(5);
    });
});
