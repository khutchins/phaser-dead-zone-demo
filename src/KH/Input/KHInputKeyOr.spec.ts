import { assert } from 'chai';
import 'mocha';
import { KHInputKey } from './KHInputKey';
import { KHInputKeyOr } from './KHInputKeyOr';

describe('KHInputKeyOr input', () => {
    it('Should process down and just down properly.', () => {{
        let sources: KHInputKey[] = [ new KHInputKey(), new KHInputKey() ];
        let key: KHInputKeyOr = new KHInputKeyOr(null, sources);

        // Key should start unpressed.
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        // Updating one key to true should update.
        sources[0].update(true);
        sources[1].update(true);
        key.updateDerivedInput();
        assert.isTrue(sources[0].isDown());
        assert.isTrue(sources[1].isDown());
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // Updating first should clear first down.
        sources[0].update(true);
        key.updateDerivedInput();
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());

        // Clearing first should not set just down or clear down.
        sources[0].update(false);
        key.updateDerivedInput();
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());

        // Clearing second should clear down.
        sources[1].update(false);
        key.updateDerivedInput();
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        // Try it the other way around to make sure we're not caching data
        // incorrectly.
        sources[1].update(true);
        key.updateDerivedInput();
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        sources[0].update(true);
        key.updateDerivedInput();
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());

        sources[1].update(true);
        key.updateDerivedInput();
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());
    }});
});