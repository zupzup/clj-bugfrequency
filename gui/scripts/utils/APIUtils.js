/* @flow */
'use strict';

const request = require('superagent-bluebird-promise');
const p = require('bluebird');

const baseUrl = 'http://localhost:4000';
const dev = true;

module.exports = {
    getInitialData() {
        if (dev) {
            return new p((resolve) => {
                window.setTimeout(() => {
                    resolve({
                        projects: ['XLMSP', 'XXXL', 'XXXLSMD', 'RBM'],
                        taskTypes: ['Bug', 'Defect', 'Task', 'Workpackage'],
                        taskStatus: ['Done', 'Testing', 'Open', 'Closed']
                    });
                }, 1000);
            });
        }

        return request.get(`${baseUrl}/initialData`);
    },

    getCacheData() {
        if (dev) {
            return new p((resolve) => {
                window.setTimeout(() => {
                    resolve({
                        "[\"RBMC-365\"]": [],
                        "[\"RBMC-1380\"]": [],
                        "[\"RBMC-442\"]": [
                            "bin/custom/yay/testsrc/net/impl/MyRedirectHandler.java",
                            "bin/custom/core/product/impl/ProductRedirectUrlTest.java"
                        ],
                        "[\"RBMC-1251\"]": [],
                        "[\"RBMC-367\"]": [],
                        "[\"RBMC-1336\"]": [],
                        "[\"RBMC-709\"]": [],
                        "[\"RBMC-995\"]": [],
                        "[\"RBMC-1286\"]": []
                    });
                }, 1000);
            });
        }

        return request.get(`${baseUrl}/cache`);
    },

    fetchData(config) {
        if (dev) {
            return new p((resolve) => {
                if (Math.random(0, 1) > 0.6) {
                    window.setTimeout(() => {
                        resolve({
                            'file1': ['task1', 'task2'],
                            'file2.js': ['task3', 'task4']
                        });
                    }, 1000);
                } else if (Math.random(0, 1) > 0.8) {
                    window.setTimeout(() => {
                        resolve({
                            'file1.java': ['task1', 'task2', 'task3', 'task4'],
                            'file2.java': ['task1', 'task2'],
                            'file3.js': ['task3'],
                            'file4.java': ['task4']
                        });
                    }, 1000);
                } else {
                    window.setTimeout(() => {
                        resolve({
                            'file1.java': ['task1', 'task2', 'task3', 'task4',
                                'task5', 'task6', 'task7', 'task8', 'task9',
                                'task10', 'task012', 'task13', 'task12', 'task15',
                                'task21', 'task31', 'task153', 'task212', 'task335', 'task1532',
                                'task2322', 'task32344', 'task1232', 'task2242', 'task3123',
                            'task12352', 'task223525', 'task32434'],
                            'file2.js': ['task1', 'task2'],
                            '.file3': ['task3'],
                            'file4.rb': ['yay']
                        });
                    }, 1000);
                }
            });
        }

        if (config.values) {
            return request.get(baseUrl + '/fetchp?' +
                'projects=' + config.values.projects +
                '&issuetypes=' + config.values.issuetypes +
                '&statuses=' + config.values.statuses +
                '&datefrom=' + config.values.datefrom +
            '&dateto=' + config.values.dateto);
        } else {
            return request.get(`${baseUrl}/fetch?jql=${config.jql}`);
        }
    }
};
