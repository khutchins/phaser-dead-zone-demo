import { assert } from 'chai';
import 'mocha';
import { KHInputKeyRepeating } from './KHInputKeyRepeating';
import { KHInputKey } from './KHInputKey';

describe('KHInputKeyRepeating input', () => {
    it('Should process repeating inputs properly.', () => {{
        let source = new KHInputKey();

        let key: KHInputKeyRepeating = new KHInputKeyRepeating(null, source, 100, 20);

        // Key should start unpressed.
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        // Initial key press should trigger is down & just down.
        source.update(true);
        key.updateDerivedInput(0);
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // New input without time change should not trigger repeat.
        source.update(true);
        key.updateDerivedInput(0);
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());

        // Advancing 10 ms should not trigger repeat.
        source.update(true);
        key.updateDerivedInput(10);
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());

        // Advancing past incremental delay without initial delay should not trigger repeat.
        source.update(true);
        key.updateDerivedInput(30);
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());

        // Advancing to initial delay should trigger repeat.
        source.update(true);
        key.updateDerivedInput(100);
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // But only once.
        source.update(true);
        key.updateDerivedInput(100);
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());

        // Advancing a small amount should not trigger repeat.
        source.update(true);
        key.updateDerivedInput(110);
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());

        // Reaching time should trigger repeat.
        source.update(true);
        key.updateDerivedInput(120);
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // Reaching time exactly should trigger repeat.
        source.update(true);
        key.updateDerivedInput(140);
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // Passing time by > the repeat delay should trigger repeat.
        source.update(true);
        key.updateDerivedInput(165);
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // Clearing source should clear repeater.
        source.update(false);
        key.updateDerivedInput(165);
        assert.isFalse(key.isDown());
        assert.isFalse(key.isJustDown());

        // Advancing by initial again should work.
        source.update(true);
        key.updateDerivedInput(265);
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // Try again with smaller incremental timings.
        source = new KHInputKey();
        key = new KHInputKeyRepeating(null, source, 20, 100);
        source.update(true);
        key.updateDerivedInput(0);
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // Clear out just down to be sure.
        source.update(true);
        key.updateDerivedInput(0);
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());

        // Advance by a too-small amount of time.
        source.update(true);
        key.updateDerivedInput(10);
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());

        // Trigger inital delay.
        source.update(true);
        key.updateDerivedInput(20);
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // Advance by initial delay (too small to reach incremental).
        source.update(true);
        key.updateDerivedInput(40);
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());

        // Reach incremental.
        source.update(true);
        key.updateDerivedInput(120);
        assert.isTrue(key.isDown());
        assert.isTrue(key.isJustDown());

        // Partway through incremental.
        source.update(true);
        key.updateDerivedInput(170);
        assert.isTrue(key.isDown());
        assert.isFalse(key.isJustDown());
    }});
});