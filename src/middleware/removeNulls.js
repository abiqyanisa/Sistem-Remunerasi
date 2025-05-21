function removeNulls(obj, seen = new WeakSet()) {
    if (obj === null || obj === undefined) return undefined;

    if (typeof obj !== 'object') return obj;

    if (seen.has(obj)) return undefined;
    seen.add(obj);

    if (Array.isArray(obj)) {
        return obj
        .map(item => removeNulls(item, seen))
        .filter(item => item !== undefined);
    }

    return Object.entries(obj).reduce((acc, [key, value]) => {
        const cleaned = removeNulls(value, seen);
        if (cleaned !== undefined) {
        acc[key] = cleaned;
        }
        return acc;
    }, {});
}

export default removeNulls;