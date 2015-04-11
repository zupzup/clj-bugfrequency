/* @flow */
'use strict';

const React = require('react');
const mori = require('mori');
const FileRow = require('../components/FileRow');
const LoadingIndicator = require('../components/LoadingIndicator');
const NoData = require('../components/NoData');
const shouldPureComponentUpdate = require('react-pure-render').function;

class FileListing extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes: {
       data: React.PropTypes.object,
       loading: React.PropTypes.bool
    }

    constructor(props) {
        super(props);
        this._prepareData = this._prepareData.bind(this);
    }

    render() {
        if (this.props.loading) {
            return (<LoadingIndicator />);
        } else if (mori.count(this.props.data) === 0) {
            return (<NoData />);
        }

        return (
            <div className='file-listing'>
                {mori.toJs(this._prepareData(this.props.data || mori.list()))}
            </div>
        );
    }

    _prepareData(data: Object) {
        return mori.map((file) => {
            return <FileRow key={file} data={file} />;
        }, data);
    }
}

export default FileListing;
