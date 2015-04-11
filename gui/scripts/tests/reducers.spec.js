const reducer = require('../stores/reducers');
const mori = require('mori');
const ActionTypes = require('../constants/ActionTypes');
const LocalStorageUtil = require('../utils/LocalStorageUtil');

describe('reducer', () => {
    describe('initialData', () => {
        it('returns the initial state', () => {
            expect(mori.count(reducer(undefined, {}).initialData)).to.equal(0);
        });

        it('returns the data from the endpoint', () => {
            expect(mori.get(reducer(undefined, {
                type: ActionTypes.GET_INITIAL_DATA_SUCCESS,
                data: {
                    value: 5
                }
            }).initialData, 'value')).to.equal(5);
        });
    });

    describe('currentData', () => {
        it('returns the initial state', () => {
            expect(mori.count(reducer(undefined, {}).currentData)).to.equal(0);
        });

        it('returns the data from the endpoint', () => {
            expect(mori.get(reducer(undefined, {
                type: ActionTypes.FETCH_DATA_SUCCESS,
                data: {
                    data: {
                        value: 5
                    }
                }
            }).currentData, 'value')).to.equal(5);
        });

        it('sets the given data', () => {
            expect(reducer(undefined, {
                type: ActionTypes.SELECT_FROM_HISTORY,
                data: {
                    value: 5
                }
            }).currentData.value).to.equal(5);
        });
    });

    describe('lastQueries', () => {
        it('returns the initial state', () => {
            LocalStorageUtil.lsGet = () => {
                return [];
            };
            expect(mori.count(reducer(undefined, {}).lastQueries)).to.equal(0);
        });

        it('returns the data from the endpoint', () => {
            expect(mori.get(reducer(undefined, {
                type: ActionTypes.FETCH_DATA_SUCCESS,
                data: {
                    data: {
                        value: 5
                    }
                }
            }).lastQueries, 'value')).to.equal(null);
        });
    });

    describe('error', () => {
        it('returns the initial state', () => {
            expect(reducer(undefined, {}).error).to.equal(null);
        });

        it('returns the error from the endpoint', () => {
            expect(reducer(undefined, {
                type: ActionTypes.FETCH_DATA_FAILURE,
                error: 'error'
            }).error).to.equal('error');
        });

        it('returns the error from the endpoint', () => {
            expect(reducer(undefined, {
                type: ActionTypes.GET_INITIAL_DATA_FAILURE,
                error: 'error'
            }).error).to.equal('error');
        });

        it('returns the error from the endpoint', () => {
            expect(reducer(undefined, {
                type: ActionTypes.FETCH_CACHE_FAILURE,
                error: 'error'
            }).error).to.equal('error');
        });
    });

    describe('loading', () => {
        it('returns the initial state', () => {
            expect(reducer(undefined, {}).loading).to.equal(false);
        });

        it('sets loading to true', () => {
            expect(reducer(undefined, {
                type: ActionTypes.FETCH_DATA
            }).loading).to.equal(true);
        });

        it('sets loading to true', () => {
            expect(reducer(undefined, {
                type: ActionTypes.FETCH_CACHE
            }).loading).to.equal(true);
        });

        it('sets loading to false', () => {
            expect(reducer(undefined, {
                type: ActionTypes.FETCH_CACHE_SUCCESS
            }).loading).to.equal(false);
        });
    });
});
