'use strict';

const React = require('react');
const JqlForm = require('./components/JqlForm').default;
const QueryForm = require('./components/QueryForm');
const FileListing = require('./components/FileListing');
const FileGraph = require('./components/FileGraph');
const Nav = require('./components/Nav');
const LastQueries = require('./components/LastQueries');
const Filter = require('./components/Filter');
const FetchCacheAction = require('./actions/FetchCacheAction');
const FetchDataAction = require('./actions/FetchDataAction');
const SelectFromHistory = require('./actions/SelectFromHistory');
const mori = require('mori');
const classNames = require('classnames');
const shouldPureComponentUpdate = require('react-pure-render').function;
const connect = require('react-redux').connect;

export class App extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    constructor(props) {
        super(props);
        this.state = {
            showQuery: true,
            showFilters: false,
            showHistory: false,
            showCache: false,
            filteredFiles: null
        };
        this._getCacheFunc = this._getCacheFunc.bind(this);
        this._getNav = this._getNav.bind(this);
        this._filterFiles = this._filterFiles.bind(this);
        this._getToggleFunc = this._getToggleFunc.bind(this);
        this._latestQueriesHandler = this._latestQueriesHandler.bind(this);
    }

    _handleJQLSubmit = (data) => {
        this.props.dispatch(FetchDataAction({
            data
        }));
    }

    _latestQueriesHandler(index: number) {
        const data = mori.get(mori.nth(this.props.lastQueries, index), 'data');
        this.props.dispatch(SelectFromHistory(data));
        this.setState({
            filteredFiles: null
        });
    }

    render() {
        const currentData = this.props.currentData,
            filteredFiles = this.state.filteredFiles || this.props.currentData;
        if (this.state.showCache) {
            return (
                <div className='app row'>
                    <div className='small-12 columns text-centered'>
                        <h3><i className='icon ion-stats-bars'/> Taskfrequency</h3>
                    </div>
                    <div className='small-12 columns'>
                        <Nav data={this._getNav()} />
                    </div>
                    <div className='small-12 columns'>
                        CacheItems
                    </div>
                </div>
            );
        }

        return (
            <div className='app row'>
                <div className='small-12 columns text-centered'>
                    <h3><i className='icon ion-stats-bars'/> Taskfrequency</h3>
                </div>
                <div className='small-12 columns'>
                    <Nav data={this._getNav()} />
                </div>
                <div className={this.state.showHistory ? 'nav' : 'nav hidden'}>
                    <div className='small-12 columns'>
                        <LastQueries handler={this._latestQueriesHandler} data={this.props.lastQueries} />
                    </div>
                </div>
                <div className={classNames('nav', {'hidden': !this.state.showQuery})}>
                    <div className='small-12 columns'>
                        <JqlForm onSubmit={this._handleJQLSubmit.bind(this)}/>
                    </div>
                    <div className='small-12 columns'>
                        <QueryForm dispatch={this.props.dispatch} initialData={this.props.initialData} />
                    </div>
                </div>
                <div>
                    <div className='small-12 columns'>
                        <Filter filterHandler={this._filterFiles}
                            filteredData={filteredFiles} data={currentData} />
                    </div>
                </div>
                <div className='small-12 medium-6 columns'>
                    <FileListing data={filteredFiles} loading={this.props.loading} />
                </div>
                <div className='small-12 medium-6 columns'>
                    <FileGraph data={filteredFiles} loading={this.props.loading} />
                </div>
            </div>
        );
    }

    _filterFiles(filteredFiles: Object) {
        let newFiles;
        if (filteredFiles) {
            newFiles = mori.filter((file) => {
                return !!mori.some((f) => f === mori.nth(file, 0), filteredFiles);
            }, this.props.currentData);
        } else {
            newFiles = null;
        }
        this.setState({
            filteredFiles: newFiles
        });
        return newFiles;
    }

    _getNav(): Array<Object> {
        return [
            {
                handler: this._getToggleFunc('showQuery'),
                icon: 'ion-search',
                label: 'Query',
                state: this.state.showQuery
            },
            {
                handler: this._getToggleFunc('showHistory'),
                icon: 'ion-ios-clock',
                label: 'History',
                state: this.state.showHistory
            },
            {
                handler: this._getCacheFunc,
                icon: 'ion-ios-cloud-upload',
                label: 'Cache',
                state: this.state.showCache
            }
        ];
    }

    _getToggleFunc(key: string): Function {
        let stateObj = {};
        stateObj[key] = !this.state[key];
        stateObj.showCache = false;
        return (e) => {
            e.preventDefault();
            this.setState(stateObj);
        };
    }

    _getCacheFunc() {
        if (!this.state.showCache) {
            this.props.dispatch(FetchCacheAction());
        }
        this.setState({
            showCache: !this.state.showCache
        });
    }
}

function select(state) {
    return {
        initialData: state.initialData,
        currentData: state.currentData,
        lastQueries: state.lastQueries,
        loading: state.loading
    };
}


export default connect(select)(App);
