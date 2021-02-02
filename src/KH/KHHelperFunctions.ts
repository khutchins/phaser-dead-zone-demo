export const lerpColor = function(col1: number, col2: number, percent: number): number {
    const r1 = col1 >> 16,
          g1 = col1 >> 8 & 0xFF,
          b1 = col1 & 0xFF;

    const r2 = col2 >> 16,
          g2 = col2 >> 8 & 0xFF,
          b2 = col2 & 0xFF;

    const r = r1 + percent * (r2 - r1),
          g = g1 + percent * (g2 - g1),
          b = b1 + percent * (b2 - b1);

    return (r << 16) + (g << 8) + (b | 0);
};

export function centerText(text: any): void {
    const bounds = text.getBounds();
    text.x -= bounds.width/2;
    text.y -= bounds.height/2;
}

export function center(x: number, y: number, w: number, h: number): [number, number] { 
    return [w/2 + x, h/2 + y];
}

export function corner(cx: number, cy: number, w: number, h: number): [number, number] { 
    return [cx - w/2, cy - h/2];
}

/**
 * Returns a random object from an array.
 * @param arr Array to retrieve object from.
 */
export function getRandom(arr: any[]): any {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns random integern number between min (inclusive) and max (exclusive).
 * @param min Minimum value (inclusive).
 * @param maxExclusive Maximum value (exclusive).
 */
export function getRandomInt(min: number, maxExclusive: number): number {
    return Math.floor(Math.random() * (maxExclusive - min) + min);
}

export function darken(color: number, percent: number) {
    let r = Math.floor((color >> 16) * (1 - percent));
    let g = Math.floor(((color >> 8) & 0xFF) * (1 - percent));
    let b = Math.floor((color & 0xFF) * (1 - percent));
    return (r << 16) | (g << 8) | b;
}

export function getFormattedTime(time: number): string {
    const ms = "" + Math.floor((time % 1000) / 10);
    const secs = "" + Math.floor(time / 1000) % 60;
    const mins = "" + Math.floor(time / 60000);
    return mins.padStart(2, ' ') + ":" + secs.padStart(2, '0') + "." + ms.padStart(2, '0')
}

/**
 * Guarantees that a value will be between (0, length]. Useful for getting index
 * in bounds of an array when it can be negative or positive.
 * @param val Number to normalize.
 * @param length Length of array.
 */
export function inRange(val: number, length: number): number {
    while (val < 0) {
        val += length;
    }
    if (val >= length) {
        val %= length;
    }
    return val;
}

/**
 * Shuffles an array in place.
 * @param array Array to shuffle.
 */
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Creates an array filled numbers from start (inclusive) to end (exclusive).
 */
export function range(start: number, endExclusive: number) {
    return [...Array(endExclusive - start).keys()].map(i => i + start);
}

export function repeat(arr: any[], times: number) {
    let ret = [];
    for (let i = 0; i < times; i++) {
        ret = ret.concat(arr);
    }
    return ret;
}

// Returns true if val is between num1 (exclusive) and num2 (inclusive).
export function isBetween(num1: number, val: number, num2: number) {
    return num1 < val && val <= num2;
}

/**
 * Returns whether or not num1 and num2 are in different iterations of a loop
 * of length repeatVal, where num2 > num1.
 * @param num1 Initial number
 * @param repeatVal Length of repeat cycle
 * @param num2 Second number
 */
export function looped(num1: number, repeatVal: number, num2: number) {
    let loop1 = num1 / repeatVal;
    let loop2 = num2 / repeatVal;
    let ceilLoop1 = Math.ceil(loop1);
    return loop2 >= loop1 + 1 || (loop1 < ceilLoop1 && ceilLoop1 <= loop2);
}