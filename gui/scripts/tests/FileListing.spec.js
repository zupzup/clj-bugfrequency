'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const FileListing = require('../components/FileListing');
const TestUtils = require('react-addons-test-utils');
const mori = require('mori');

describe('FileListing', () => {
    it('shows a loading indicator if it is loading', () => {
        const res = TestUtils.renderIntoDocument(<FileListing loading={true} />);
        const spinner = TestUtils.findRenderedDOMComponentWithClass(res, 'spinner');
        expect(spinner).not.to.equal(undefined);
    });

    it('shows no data if there is none', () => {
        const res = TestUtils.renderIntoDocument(<FileListing data={mori.list()} />);
        expect(ReactDOM.findDOMNode(res).textContent).to.equal("No Data");
    });

    it('shows filerows for each data row', () => {
        const data = mori.toClj([
            [
                "file1",
                ['task1', 'task2']
            ]
        ]);
        const res = TestUtils.renderIntoDocument(<FileListing data={data}/>);
        expect(res).not.to.equal(undefined);
    });
});
