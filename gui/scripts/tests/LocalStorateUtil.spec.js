'use strict';

const LocalStorageUtil = require('../utils/LocalStorageUtil');

describe('LocalStorageUtil', () => {
    beforeEach(() => {
        sinon.stub(localStorage, 'getItem').returns("{\"key\": 5}");
        sinon.stub(localStorage, 'setItem');
        sinon.stub(localStorage, 'removeItem');
    });

    afterEach(() => {
        localStorage.getItem.restore();
        localStorage.setItem.restore();
        localStorage.removeItem.restore();
    });

    it('return a parsed response on lsGet', () => {
        expect(LocalStorageUtil.lsGet('key').key).to.equal(5);
    });

    it('saves a key for lsSet', () => {
        LocalStorageUtil.lsSet('key', 5);
        expect(localStorage.setItem.calledOnce).to.equal(true);
    });

    it('removes a key for lsRemove', () => {
        LocalStorageUtil.lsRemove('key');
        expect(localStorage.removeItem.calledOnce).to.equal(true);
    });
});
