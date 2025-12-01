// utils/shuffle.ts
export function stringToSeed(s: string): number {
    // simple hash -> 32-bit int
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
    }
    return h;
}

// tiny xorshift32 PRNG (pure)
export function xorshift32(seed: number) {
    let state = seed >>> 0;
    return () => {
        // xorshift algorithm
        state ^= state << 13;
        state = state >>> 0;
        state ^= state >>> 17;
        state = state >>> 0;
        state ^= state << 5;
        state = state >>> 0;
        return (state >>> 0) / 0xFFFFFFFF;
    };
}

export function shuffleWithSeed<T>(array: readonly T[], seed: number): T[] {
    const result = [...array];
    const rand = xorshift32(seed);
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}