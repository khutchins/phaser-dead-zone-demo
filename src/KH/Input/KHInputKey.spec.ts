import { assert } from 'chai';
import 'mocha';
import { KHInputKey } from './KHInputKey';

describe('KHInputKey input', () => {
    it('Should process down and just down properly.', () => {{
        let key: KHInputKey = new KHInputKey();

        // Key should start unpressed.
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        // Updating to false should set not set it as down or just down.
        key.update(false);
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        // Updating to true should set it to true.
        key.update(true);
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // Is just down should remain true until the underlying key updates.
        assert.isTrue(key.isJustDown());

        // A second update should clear just down.
        key.update(true);
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());

        // Updating to false should clear down and just down.
        key.update(false);
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());
    }});
});