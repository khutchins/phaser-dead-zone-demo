import { assert } from 'chai';
import 'mocha';
import { KHInputKey } from './KHInputKey';
import { KHInputKeyCompeting } from './KHInputKeyCompeting';

describe('KHInputKeyCompeting input', () => {
    it('Should process down and just down properly.', () => {{
        let source: KHInputKey = new KHInputKey();
        let competing: KHInputKey = new KHInputKey();
        let key: KHInputKeyCompeting = new KHInputKeyCompeting(null, source, competing, false);

        // Key should start unpressed.
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        source.update(false);
        key.updateDerivedInput();
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        competing.update(false);
        key.updateDerivedInput();
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        // If only competing is pressed, it is not considered pressed.
        competing.update(true);
        key.updateDerivedInput();
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        // If source is then pressed, it *is* considered pressed.
        competing.update(true);
        source.update(true);
        key.updateDerivedInput();
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // Releasing competing does not prevent the key from being down.
        competing.update(false);
        key.updateDerivedInput();
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());

        // Competing becomes the last held input.
        competing.update(true);
        key.updateDerivedInput();
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        // Clear inputs
        source.update(false);
        competing.update(false);

        // If input is preferred, same frame activation should go to source.
        key = new KHInputKeyCompeting(null, source, competing, true);
        source.update(true);
        competing.update(true);
        key.updateDerivedInput();
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // Clear inputs
        source.update(false);
        competing.update(false);

        // If input is not preferred, same frame activation should go to competitor.
        key = new KHInputKeyCompeting(null, source, competing, false);
        source.update(true);
        competing.update(true);
        key.updateDerivedInput();
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());
    }});
});