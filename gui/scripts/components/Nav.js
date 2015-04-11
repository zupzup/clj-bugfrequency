'use strict';

const React = require('react');
const classNames = require('classnames');
const shouldPureComponentUpdate = require('react-pure-render').function;

class Nav extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes = {
        data: React.PropTypes.array
    }

    render() {
        const data = this.props.data || [],
            nav = data.map((navItem) => {
                return (<a key={navItem.label}
                    className={classNames('item', {'active': navItem.state})} onClick={navItem.handler}>
                    <i className={classNames('icon', navItem.icon)}></i>
                    <label>{navItem.label}</label>
                </a>);
            });

        return (
            <div className="icon-bar three-up label-right">
                {nav}
            </div>
        );
    }
}

export default Nav;

