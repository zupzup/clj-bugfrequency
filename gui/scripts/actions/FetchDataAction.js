/* @flow */
'use strict';

const ActionTypes = require('../constants/ActionTypes');
const APIUtils = require('../utils/APIUtils');

module.exports = (config: Object) => {
    return function(dispatch) {
        dispatch({
            type: ActionTypes.FETCH_DATA
        });
        APIUtils.fetchData(config).then((data) => {
            const result = {
                config,
                data
            };
            dispatch({
                type: ActionTypes.FETCH_DATA_SUCCESS,
                data: result
            });
        }).catch((error) => {
            dispatch({
                type: ActionTypes.FETCH_DATA_FAILURE,
                error
            });
        });
    };
};
