'use strict';

const React = require('react');
// const ReactD3 = require('react-d3-components');
const {PieChart} = require('react-d3');
const LoadingIndicator = require('../components/LoadingIndicator');
const mori = require('mori');
const NoData = require('../components/NoData');
const shouldPureComponentUpdate = require('react-pure-render').function;

class FileGraph extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    constructor(props) {
        super(props);
        this._tooltip = this._tooltip.bind(this);
        this._getChartWidth = this._getChartWidth.bind(this);
        this._prepareData = this._prepareData.bind(this);
    }

    static propTypes = {
        data: React.PropTypes.object,
        loading: React.PropTypes.bool
    }

    render() {
        if (this.props.loading) {
            return (<LoadingIndicator />);
        } else if (mori.count(this.props.data) === 0) {
            return (<NoData />);
        }

        const windowWidth = this._getChartWidth(window.innerWidth);
        const windowHeight = (windowWidth * 0.8) | 1;

        return (
            <div className='file-graph'>
                <PieChart data={this._prepareData(this.props.data || mori.hashMap())}
                    width={windowWidth} height={windowHeight} radius={150}
                    innerRadius={0} sectorBorderColor="white" title="Chart" />
            </div>
        );
    }

    _getChartWidth(windowWidth: number): number {
        if (windowWidth <= 640) {
            return (window.innerWidth * 0.8) | 1;
        } else {
            return (window.innerWidth * 0.4) | 1;
        }
    }

    _tooltip(x: number, y: number): string {
        return `${x}: ${y}`;
    }

    _prepareData(data: Object): Object {
        return mori.toJs(mori.map((file) => {
            return {
                label: mori.nth(file, 0),
                value: mori.count(mori.nth(file, 1) || mori.list())
            };
        }, data));
    }
}

export default FileGraph;
