'use strict';

const React = require('react');
const shouldPureComponentUpdate = require('react-pure-render').function;

class LoadingIndicator extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        return (
            <div className='spinner'>
                <div className="dot1"></div>
                <div className="dot2"></div>
            </div>
        );
    }
}

export default LoadingIndicator;
