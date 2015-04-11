'use strict';

const React = require('react');
const Nav = require('../components/Nav');
const TestUtils = require('react-addons-test-utils');

describe('Nav', () => {
    it('shows the nav items', () => {
        const res = TestUtils.renderIntoDocument(<Nav data={[
            {
                label: 'home',
                icon: 'home'
            },
            {
                label: 'filters',
                icon: 'filters',
                state: 'active'
            }
        ]} />);
        expect(res).not.to.equal(undefined);
        const home = TestUtils.findRenderedDOMComponentWithClass(res, 'icon home');
        const filters = TestUtils.findRenderedDOMComponentWithClass(res, 'icon filters');
        expect(home).not.to.equal(undefined);
        expect(filters).not.to.equal(undefined);
    });
});
