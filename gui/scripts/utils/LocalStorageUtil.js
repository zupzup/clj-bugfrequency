/* @flow */
'use strict';

const prefix = 'tfreq_';
const LocalStorageUtil = {
    lsGet(key) {
        return JSON.parse(localStorage.getItem(prefix + key));
    },

    lsRemove(key) {
        localStorage.removeItem(prefix + key);
    },

    lsSet(key, value) {
        localStorage.setItem(prefix + key, JSON.stringify(value));
    }
};

module.exports = LocalStorageUtil;
