/* @flow */
'use strict';

const ActionTypes = require('../constants/ActionTypes');
const APIUtils = require('../utils/APIUtils');

module.exports = () => {
    return function(dispatch) {
        APIUtils.getInitialData().then((data) => {
            dispatch({
                type: ActionTypes.GET_INITIAL_DATA_SUCCESS,
                data
            });
        }).catch((error) => {
            dispatch({
                type: ActionTypes.GET_INITIAL_DATA_FAILURE,
                error
            });
        });
    };
};
