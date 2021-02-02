import { assert } from 'chai';
import 'mocha';
import { KHInputKey } from './KHInputKey';
import { KHInputKeyNever } from './KHInputKeyNever';

class KHInputKeyNeverInternal extends KHInputKeyNever {
    updateInternalPublic(down: boolean, justDown: boolean) {
        super.updateInternal(down, justDown);
    }
}

describe('KHInputKeyNever input', () => {
    it('Should never report down or just down.', () => {{
        let source: KHInputKey = new KHInputKey();
        let competing: KHInputKey = new KHInputKey();
        let key: KHInputKeyNever = new KHInputKeyNever();

        // Key should start unpressed.
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        // Key should still be unpressed.
        key.update(true);
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        let internalKey = new KHInputKeyNeverInternal();
        assert.isFalse(internalKey.isDown());
        assert.isFalse(internalKey.isJustDown());

        internalKey.updateInternalPublic(true, true);
        assert.isFalse(internalKey.isDown());
        assert.isFalse(internalKey.isJustDown());
    }});
});