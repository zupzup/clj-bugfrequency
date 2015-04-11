const redux = require('redux');
const ActionTypes = require('../constants/ActionTypes');
const LocalStorageUtil = require('../utils/LocalStorageUtil');
const mori = require('mori');
const reduxForm = require('redux-form');
const formReducer = reduxForm.reducer;

function initialData(state = mori.hashMap(), action) {
    switch (action.type) {
    case ActionTypes.GET_INITIAL_DATA_SUCCESS:
        return mori.toClj(action.data);
    default:
        return state;
    }
}

function currentData(state = mori.hashMap(), action) {
    switch (action.type) {
    case ActionTypes.FETCH_DATA_SUCCESS:
        return mori.toClj(action.data.data);
    case ActionTypes.SELECT_FROM_HISTORY:
        return action.data;
    default:
        return state;
    }
}

function lastQueries(state, action) {
    switch (action.type) {
    case ActionTypes.FETCH_DATA_SUCCESS:
        const lastQueryData = {
            config: action.data.config,
            data: action.data.data
        };
        const _lastQueries = mori.take(10, mori.cons(mori.toClj(lastQueryData), state));
        LocalStorageUtil.lsSet('lastQueries', mori.toJs(_lastQueries));
        return _lastQueries;
    default:
        return mori.toClj(LocalStorageUtil.lsGet('lastQueries'));
    }
}

function error(state = null, action) {
    switch (action.type) {
    case ActionTypes.FETCH_DATA_FAILURE:
        return action.error;
    case ActionTypes.FETCH_CACHE_FAILURE:
        return action.error;
    case ActionTypes.GET_INITIAL_DATA_FAILURE:
        return action.error;
    default:
        return state;
    }
}

function loading(state = false, action) {
    switch (action.type) {
    case ActionTypes.FETCH_DATA:
        return true;
    case ActionTypes.FETCH_CACHE:
        return true;
    case ActionTypes.FETCH_DATA_SUCCESS:
        return false;
    case ActionTypes.FETCH_DATA_FAILURE:
        return false;
    case ActionTypes.FETCH_CACHE_SUCCESS:
        return false;
    case ActionTypes.FETCH_CACHE_FAILURE:
        return false;
    default:
        return state;
    }
}

const frequencyApp = redux.combineReducers({
    initialData,
    lastQueries,
    currentData,
    loading,
    error,
    form: formReducer
});

export default frequencyApp;
