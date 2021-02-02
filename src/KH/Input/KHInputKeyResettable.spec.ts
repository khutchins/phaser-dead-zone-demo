import { assert } from 'chai';
import 'mocha';
import { KHInputKeyResettable } from './KHInputKeyResettable';
import { KHInputKey } from './KHInputKey';

describe('KHInputKeyResettable input', () => {
    it('Should process down and just down properly as well as reset.', () => {{
        let key: KHInputKey = new KHInputKey();
        let resettableKey: KHInputKeyResettable = new KHInputKeyResettable(null, key);

        // Key should start unpressed.
        assert.isFalse(resettableKey.isDown());
        assert.isFalse(resettableKey.isJustDown());

        // Updating to false should set not set it as down or just down.
        key.update(false);
        resettableKey.updateDerivedInput();
        assert.isFalse(resettableKey.isDown());
        assert.isFalse(resettableKey.isJustDown());

        // Updating to true should set it to true.
        key.update(true);
        resettableKey.updateDerivedInput();
        assert.isTrue(resettableKey.isDown());
        assert.isTrue(resettableKey.isJustDown());

        // A second update should clear just down.
        key.update(true);
        resettableKey.updateDerivedInput();
        assert.isTrue(resettableKey.isDown());
        assert.isFalse(resettableKey.isJustDown());

        // Updating to false should clear down and just down.
        key.update(false);
        resettableKey.updateDerivedInput();
        assert.isFalse(resettableKey.isDown());
        assert.isFalse(resettableKey.isJustDown());

        // Test out resetting
        key.update(true);
        resettableKey.updateDerivedInput();
        assert.isTrue(resettableKey.isDown());
        assert.isTrue(resettableKey.isJustDown());

        // Resetting should clear down.
        resettableKey.reset();
        assert.isFalse(resettableKey.isDown());
        assert.isFalse(resettableKey.isJustDown());

        // Setting to true once more should reset in values still being false.
        key.update(true);
        resettableKey.updateDerivedInput();
        assert.isFalse(resettableKey.isDown());
        assert.isFalse(resettableKey.isJustDown());

        // Updating to false should clear requires reset flag but still have not
        // down values.
        key.update(false);
        resettableKey.updateDerivedInput();
        assert.isFalse(resettableKey.isDown());
        assert.isFalse(resettableKey.isJustDown());

        // Now should be set to true.
        key.update(true);
        resettableKey.updateDerivedInput();
        assert.isTrue(resettableKey.isDown());
        assert.isTrue(resettableKey.isJustDown());
        
    }});
});