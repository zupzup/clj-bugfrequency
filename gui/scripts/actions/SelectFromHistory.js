/* @flow */
'use strict';

const ActionTypes = require('../constants/ActionTypes');

module.exports = (data) => {
    return function(dispatch) {
        dispatch({
            type: ActionTypes.SELECT_FROM_HISTORY,
            data
        });
    };
};
