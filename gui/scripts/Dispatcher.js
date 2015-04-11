'use strict';

const {Dispatcher} = require('flux');
const assign = require('object-assign');

const AppDispatcher = assign(new Dispatcher(), {
    handleAction(action) {
        this.dispatch(action);
    }
});

module.exports = AppDispatcher;
