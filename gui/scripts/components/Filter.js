/* @flow weak*/
'use strict';

const React = require('react');
const Select = require('react-select');
const mori = require('mori');
const fuzzaldrin = require('fuzzaldrin');
const shouldPureComponentUpdate = require('react-pure-render').function;

class Filter extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes: {
        data: React.PropTypes.object,
        filteredData: React.PropTypes.object,
        filterHandler: React.PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            extensions: null
        };

        this._getFileExtensions = this._getFileExtensions.bind(this);
        this._fuzzySearch = this._fuzzySearch.bind(this);
        this._applyFuzzyFilter = this._applyFuzzyFilter.bind(this);
        this._applyExtensionFilter = this._applyExtensionFilter.bind(this);
        this._extensionFilter = this._extensionFilter.bind(this);
        this._getFileList = this._getFileList.bind(this);
        this._allHandler = this._allHandler.bind(this);
    }

    _getFileExtensions(files) {
        const re = /(?:\.([^.]+))?$/;
        return mori.toJs(
            mori.distinct(
                mori.filter((file) => {
                    return file != null;
                },
                mori.map((file) => {
                    return re.exec(mori.nth(file, 0))[1];
                }, files))));
    }

    _fuzzySearch() {
        const query = this.refs.filter.value;
        const extensions = this.state.extensions;
        const fileList = this._getFileList(this.props.data);
        let filtered;
        if (!query) {
            filtered = fileList;
        } else {
            filtered = this._applyFuzzyFilter(query, fileList);
        }
        if (extensions) {
            filtered = this._applyExtensionFilter(extensions.split(','), filtered);
        }
        (this.props.filterHandler: any)(filtered);
    }

    _applyFuzzyFilter(query, files) {
        return mori.toClj(fuzzaldrin.filter(mori.toJs(files), query));
    }

    _applyExtensionFilter(extensions, files) {
        return mori.filter((file) => {
            return mori.some((extension) => {
                return file.lastIndexOf(`.${extension}`) !== -1;
            }, mori.toClj(extensions));
        }, files);
    }

    _extensionFilter(val) {
        this.setState({
            extensions: val || null
        });
        const query = this.refs.filter.value;
        const fileList = this._getFileList(this.props.data);
        let filtered;
        if (!val || val.length === 0) {
            filtered = fileList;
        } else {
            filtered = this._applyExtensionFilter(val.split(','), fileList);
        }
        if (query) {
            filtered = this._applyFuzzyFilter(query, filtered);
        }
        (this.props.filterHandler: any)(filtered);
    }

    _getFileList(data) {
        return mori.map((file) => {
            return mori.nth(file, 0);
        }, data);
    }

    _allHandler() {
        this.setState({
            extensions: null
        });
        this.refs.filter.value = '';
        (this.props.filterHandler: any)(null);
    }

    render() {
        const files = this.props.data;
        const options = this._getFileExtensions(files).map((file) => {
            return {value: file, label: file};
        });

        return (
            <div className='row overflow'>
                <div className='small-12 medium-3 columns'>
                    <dl className='sub-nav'>
                        <dt>Filter:</dt>
                        <dd><a onClick={this._allHandler}>All</a></dd>
                    </dl>
                </div>
                <div className='small-12 medium-5 columns'>
                    <input onChange={this._fuzzySearch} type='text'
                        ref='filter' name='filter' placeholder='filter..' />
                </div>
                <div className='small-12 medium-4 columns'>
                    <Select ref='extensions' name='extensions'
                        placeholder='Extensions..' options={options}
                        multi={true} onChange={this._extensionFilter}
                        value={this.state.extensions} />
                </div>
            </div>
        );
    }
}

export default Filter;
