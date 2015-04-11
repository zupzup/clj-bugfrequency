/* @flow */
'use strict';

const ActionTypes = require('../constants/ActionTypes');
const APIUtils = require('../utils/APIUtils');

module.exports = () => {
    return function(dispatch) {
        dispatch({
            type: ActionTypes.FETCH_CACHE
        });

        APIUtils.getCacheData().then((data) => {
            dispatch({
                type: ActionTypes.FETCH_CACHE_SUCCESS,
                data: data
            });
        }).catch((error) => {
            dispatch({
                type: ActionTypes.FETCH_CACHE_FAILURE,
                error
            });
        });
    };
};
