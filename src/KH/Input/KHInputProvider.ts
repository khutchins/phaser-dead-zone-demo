export class KHInputProvider {

    static lastInputSource: KHInputProvider;

    /**
     * Attempt to vibrate the input source.
     * @param duration Duration in millis
     * @param weak Magnitude of weak rumble (0-1)
     * @param strong Magnitude of strong rumble (0-1)
     */
    tryVibrate(duration: number, weak: number, strong: number) {
        // Default is no implementation.
    }

    type(): string {
        return null;
    }

    getId(): string {
        return "";
    }
}