'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const rewire = require('rewire');
const Filter = rewire('../components/Filter');
const TestUtils = require('react-addons-test-utils');
const mori = require('mori');

describe('Filters', () => {
    it('returns a list of files', () => {
        const res = TestUtils.renderIntoDocument(<Filter />);
        expect(mori.toJs(res._getFileList(mori.toClj([
            [
                "file1",
                "task1"
            ]
        ]))).length).to.equal(1);
    });

    it('sets state and calls the filterhandler', () => {
        const res = TestUtils.renderIntoDocument(<Filter filterHandler={sinon.spy()}/>);
        res.setState = sinon.spy();
        res._allHandler();
        expect(res.setState.calledOnce).to.equal(true);
    });

    it('renders filters', () => {
        const res = TestUtils.renderIntoDocument(<Filter filterHandler={sinon.spy()} data={mori.toClj(
            [
                [
                    "file.js",
                    "task"
                ]
            ]
        )}/>);
        const subnav = TestUtils.findRenderedDOMComponentWithClass(res, 'sub-nav');
        expect(subnav).not.to.equal(undefined);
    });

    it('does a fuzzy search', () => {
        const filterSpy = sinon.spy();
        const res = TestUtils.renderIntoDocument(<Filter filterHandler={filterSpy}/>);
        res._fuzzySearch();
        expect(filterSpy.calledOnce).to.equal(true);
    });

    it('does a fuzzy search and uses the extensions as well', () => {
        const filterSpy = sinon.spy();
        const res = TestUtils.renderIntoDocument(<Filter filterHandler={filterSpy} data={mori.toClj(
            [
                [
                    "file.js",
                    "task"
                ],
                [
                    "file.java",
                    "task"
                ]
            ]
        )}/>);
        res.state.extensions = '.js, .java';
        res._fuzzySearch();
        expect(filterSpy.calledOnce).to.equal(true);
    });

    it('does a fuzzy search and uses the query', () => {
        const filterSpy = sinon.spy();
        const res = TestUtils.renderIntoDocument(<Filter filterHandler={filterSpy}/>);
        ReactDOM.findDOMNode(res.refs.filter).value = "js";
        res._fuzzySearch();
        expect(filterSpy.calledOnce).to.equal(true);
    });

    it('applies the extension filter', () => {
        const res = TestUtils.renderIntoDocument(<Filter />);
        const result = res._applyExtensionFilter(['js'], mori.toClj(['yay.js', 'bla', 'blub', 'ya.java']));
        expect(mori.count(result)).to.equal(1);
    });

    it('filters by extension', () => {
        const filterSpy = sinon.spy();
        const res = TestUtils.renderIntoDocument(<Filter filterHandler={filterSpy} data={mori.toClj(
            [
                [
                    "file.js",
                    "task"
                ],
                [
                    "file.java",
                    "task"
                ]
            ]
        )}/>);
        res.state.extensions = '.js, .java';
        res._extensionFilter('js');
        expect(filterSpy.calledOnce).to.equal(true);
    });

    it('filters by extension for no value', () => {
        const filterSpy = sinon.spy();
        const res = TestUtils.renderIntoDocument(<Filter filterHandler={filterSpy} data={mori.toClj(
            [
                [
                    "file.js",
                    "task"
                ],
                [
                    "file.java",
                    "task"
                ]
            ]
        )}/>);
        res.state.extensions = '.js, .java';
        res._extensionFilter();
        expect(filterSpy.calledOnce).to.equal(true);
    });

    it('filters by extension and applies fuzzy as well', () => {
        const filterSpy = sinon.spy();
        const res = TestUtils.renderIntoDocument(<Filter filterHandler={filterSpy} data={mori.toClj(
            [
                [
                    "file.js",
                    "task"
                ],
                [
                    "file.java",
                    "task"
                ]
            ]
        )}/>);
        ReactDOM.findDOMNode(res.refs.filter).value = "js";
        res.state.extensions = '.js, .java';
        res._extensionFilter();
        expect(filterSpy.calledOnce).to.equal(true);
    });
});
