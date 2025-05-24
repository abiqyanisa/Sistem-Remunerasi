import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // default TTL: 1 jam

export function getCache(key) {
    return cache.get(key);
}

export function setCache(key, value, ttl = 3600) {
    cache.set(key, value, ttl);
}

export function delCache(key) {
    cache.del(key);
}

export function flushCache() {
    cache.flushAll();
}