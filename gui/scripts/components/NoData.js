'use strict';

const React = require('react');
const shouldPureComponentUpdate = require('react-pure-render').function;

class NoData extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        return (
            <div className='row nodata'>
                <div className='small-12 columns'>
                    <div>
                        No Data
                    </div>
                </div>
            </div>
        );
    }
}

export default NoData;
