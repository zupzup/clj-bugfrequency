'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const FileRow = require('../components/FileRow');
const TestUtils = require('react-addons-test-utils');
const mori = require('mori');

describe('FileRow', () => {
    it('shows filerows for all items', () => {
        const rowData = [
            "task",
            [
                "file1",
                "file2"
            ]
        ];
        const res = TestUtils.renderIntoDocument(<FileRow data={mori.toClj(rowData)} />);
        expect(res).not.to.equal(undefined);
        expect(ReactDOM.findDOMNode(res).textContent).to.equal("task2file1 file2 ");
    });

    it('shows filerows for all items', () => {
        const rowData = [
            "task",
            null
        ];
        const res = TestUtils.renderIntoDocument(<FileRow data={mori.toClj(rowData)} />);
        expect(res).not.to.equal(undefined);
        expect(ReactDOM.findDOMNode(res).textContent).to.equal("task0");
    });
});
