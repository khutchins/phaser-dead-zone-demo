import { assert } from 'chai';
import 'mocha';
import { KHInputKey } from './KHInputKey';
import { KHInputKeyAnd } from './KHInputKeyAnd';

describe('KHInputKeyAnd input', () => {
    it('Should process down and just down properly.', () => {{
        let sources: KHInputKey[] = [ new KHInputKey(), new KHInputKey() ];
        let key: KHInputKeyAnd = new KHInputKeyAnd(null, sources);

        // Key should start unpressed.
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        // Updating one key to true shouldn't update.
        sources[0].update(true);
        key.updateDerivedInput();
        assert.isTrue(sources[0].isDown());
        assert.isFalse(sources[1].isDown());
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        // Updating second should.
        sources[1].update(true);
        key.updateDerivedInput();
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // Reset
        sources[0].update(false);
        sources[1].update(false);
        key.updateDerivedInput();

        // Updating both at the same time shouldn't clear isJustDown().
        sources[0].update(true);
        sources[1].update(true);
        key.updateDerivedInput();
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // Updating both again should.
        sources[0].update(true);
        sources[1].update(true);
        key.updateDerivedInput();
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());

        // Reset to just down
        sources[0].update(false);
        sources[1].update(false);
        key.updateDerivedInput();

        sources[0].update(true);
        sources[1].update(true);
        key.updateDerivedInput();

        // Clearing one key should clear both
        sources[1].update(false);
        key.updateDerivedInput();
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());
    }});
});