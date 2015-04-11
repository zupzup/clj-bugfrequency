'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const FileGraph = require('../components/FileGraph');
const TestUtils = require('react-addons-test-utils');
const mori = require('mori');

describe('FileGraph', () => {
    it('shows a loading indicator, if it is loading', () => {
        const res = TestUtils.renderIntoDocument(<FileGraph loading={true} />);
        const spinner = TestUtils.findRenderedDOMComponentWithClass(res, 'spinner');
        expect(spinner).not.to.equal(undefined);
    });

    it('shows no data if there is none', () => {
        const res = TestUtils.renderIntoDocument(<FileGraph data={mori.list()} />);
        expect(ReactDOM.findDOMNode(res).textContent).to.equal("No Data");
    });

    it('shows filegraph for each data row', () => {
        const data = mori.toClj([
            [
                "file1",
                ['task1', 'task2']
            ]
        ]);
        const res = TestUtils.renderIntoDocument(<FileGraph data={data}/>);
        expect(res).not.to.equal(undefined);
    });

    it('shows the x and y coordinates', () => {
        const res = TestUtils.renderIntoDocument(<FileGraph />);
        expect(res._tooltip(1, 2)).to.equal("1: 2");
    });

    it('calculates the width in relation to the windowWidth', () => {
        const res = TestUtils.renderIntoDocument(<FileGraph />);
        expect(res._getChartWidth(100)).to.equal(321);
        expect(res._getChartWidth(1000)).to.equal(161);
    });
});
