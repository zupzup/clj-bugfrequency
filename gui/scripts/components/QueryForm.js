/* @flow weak*/
'use strict';

const React = require('react');
const FetchDataAction = require('../actions/FetchDataAction');
const mori = require('mori');
const Select = require('react-select');
const DatePicker = require('react-datepicker');
const moment = require('moment');
const shouldPureComponentUpdate = require('react-pure-render').function;

const DATE_FORMAT = 'YYYY-MM-DD';

class QueryForm extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes: {
       initialData: React.PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {
            projects: null,
            issuetypes: null,
            issuestatus: null,
            fromDate: moment(),
            toDate: moment()
        };

        this._getSelectValues = this._getSelectValues.bind(this);
        this._handleQueriesSubmit = this._handleQueriesSubmit.bind(this);
        this._handleProjectsChange = this._handleProjectsChange.bind(this);
        this._handleIssueTypesChange = this._handleIssueTypesChange.bind(this);
        this._handleIssueStatusChange = this._handleIssueStatusChange.bind(this);
        this._onFromDateChange = this._onFromDateChange.bind(this);
        this._onToDateChange = this._onToDateChange.bind(this);
    }

    _getSelectValues(type: string): Object {
        return mori.toJs(mori.get(this.props.initialData, type, mori.list())).map((item) => {
            return {
                value: item,
                label: item
            };
        });
    }

    _handleQueriesSubmit() {
        this.props.dispatch(FetchDataAction({
            values: {
                projects: this.state.projects,
                issuetypes: this.state.issuetypes,
                statuses: this.state.issuestatus,
                datefrom: this.state.fromDate.format(DATE_FORMAT),
                dateto: this.state.toDate.format(DATE_FORMAT)
            }
        }));
    }

    render() {
        const projects = this._getSelectValues('projects'),
            issuetypes = this._getSelectValues('taskTypes'),
            issuestatus = this._getSelectValues('taskStatus');

        return (
            <div className='row'>
                <div className='small-12 columns'>
                    Query Search:
                </div>
                <div className='small-12 medium-6 columns'>
                    <i className='icon ion-calendar cal-icon'/>
                    <DatePicker key='fromDate' placeholderText='Date from...'
                        onChange={this._onFromDateChange} selected={this.state.fromDate}
                        dateFormat={DATE_FORMAT} minDate={moment().subtract(2, 'year')} maxDate={moment()} />
                </div>
                <div className='small-12 medium-6 columns'>
                    <i className='icon ion-calendar cal-icon'/>
                    <DatePicker key='toDate' placeholderText='Date to...'
                        onChange={this._onToDateChange} selected={this.state.toDate}
                        dateFormat={DATE_FORMAT} minDate={moment().subtract(2, 'year')} maxDate={moment()} />
                </div>
                <div className='small-12 medium-4 columns'>
                    <Select ref='projects' name='projects' onChange={this._handleProjectsChange}
                        placeholder='Projects...' options={projects} multi={true} value={this.state.projects} />
                </div>
                <div className='small-12 medium-4 columns'>
                    <Select ref='issuetypes' name='issuestypes' onChange={this._handleIssueTypesChange}
                        placeholder='Types...' options={issuetypes} multi={true} value={this.state.issuetypes} />
                </div>
                <div className='small-12 medium-4 columns'>
                    <Select ref='issuestatus' name='issuestatus' onChange={this._handleIssueStatusChange}
                        placeholder='Status...' options={issuestatus}
                        multi={true} value={this.state.issuestatus} />
                </div>
                <div className='small-12 columns top-marg'>
                    <button className='button small expand' onClick={this._handleQueriesSubmit}>
                        submit
                    </button>
                </div>
            </div>
        );
    }

    _handleProjectsChange(val: string) {
        this.setState({
            projects: val || null
        });
    }

    _handleIssueTypesChange(val: string) {
        this.setState({
            issuetypes: val || null
        });
    }

    _handleIssueStatusChange(val: string) {
        this.setState({
            issuestatus: val || null
        });
    }

    _onFromDateChange(date: Object) {
        this.setState({
            fromDate: date
        });
    }

    _onToDateChange(date: Object) {
        this.setState({
            toDate: date
        });
    }
}

export default QueryForm;
