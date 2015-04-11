/* @flow */
'use strict';

const React = require('react');
const mori = require('mori');
const shouldPureComponentUpdate = require('react-pure-render').function;

class FileRow extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes: {
       data: React.PropTypes.object.isRequired
    }

    render() {
        const file = this.props.data,
            name = mori.nth(file, 0),
            tasks = mori.nth(file, 1) || mori.list(),
            taskList = mori.map((task) => {
                return (<span className='task-list' key={task}>
                    <a href='TODO' target='_blank'>{task}</a> </span>);
            }, tasks),
            numTasks = mori.count(taskList);
        return (<div className='list-row row'>
                <div className='small-10 columns'>
                    {name}
                </div>
                <div className='small-2 columns num'>
                    {numTasks}
                </div>
                <div className='small-10 columns'>
                    {mori.toJs(taskList)}
                </div>
                <div className='small-2 columns' />
        </div>);
    }
}

export default FileRow;
