/* @flow */
'use strict';

const React = require('react');
const mori = require('mori');
const shouldPureComponentUpdate = require('react-pure-render').function;

class LastQueries extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes: {
       handler: React.PropTypes.func,
       data: React.PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {
            currentSelection: -1
        };

        this._selectQuery = this._selectQuery.bind(this);
    }

    _selectQuery(e: Object, index: number) {
        e.preventDefault();
        (this.props.handler: any)(index);
        this.setState({
            currentSelection: index
        });
    }

    render() {
        if (!this.props.data || mori.count(this.props.data) === 0) {
            return (
                <div className='left nodata'>
                    No History Data
                </div>);
        }
        return (
            <div className='row'>
                <div className='small-12 columns'>
                   Last 10 Queries:
                </div>
                <div className='small-12 columns'>
                    <ul className='button-group radius'>
                        {mori.toJs(this.props.data).map((item, index) => {
                            let label = index;
                            if (this.state.currentSelection === index) {
                                label = 'current';
                            } else if (index === 0) {
                                label = 'latest';
                            }
                            const handler = (e) => {
                                this._selectQuery(e, index);
                            };
                            return (<li key={index}>
                                <a onClick={handler} className='button small'>{label}</a>
                            </li>);
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

export default LastQueries;
