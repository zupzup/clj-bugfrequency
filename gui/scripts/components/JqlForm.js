/* @flow */
'use strict';

const React = require('react');
const shouldPureComponentUpdate = require('react-pure-render').function;
const {connectReduxForm} = require('redux-form');

function validateJql(data) {
    const errors = {};
    if (!data.jql) {
        errors.jql = 'Required';
    }
    return errors;
}

export class JqlForm extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    static PropTypes = {
        fields: React.PropTypes.object.isRequired,
        handleSubmit: React.PropTypes.func.isRequired
    }

    render() {
        const {fields: {jql}, handleSubmit} = this.props;
        return (
            <div className='row'>
                <div className='small-12 columns'>
                   Search by Jql:
                </div>
                <div className='small-12 medium-10 columns'>
                    <input className='jql' {...jql} type='text' placeholder='jql...' />
                    {jql.error && jql.touched && <span className='error'>{jql.error}</span>}
                </div>
                <div className='small-12 medium-2 columns'>
                    <button onClick={handleSubmit} type='submit' className='button small expand'>submit</button>
                </div>
            </div>
        );
    }
}

export default connectReduxForm({
    form: 'jqlform',
    fields: ['jql'],
    validate: validateJql
})(JqlForm);
