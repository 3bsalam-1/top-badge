import { beforeEach, describe, expect, it } from 'vitest';
import { Cache } from './cache.js';

describe('Cache', () => {
  let cache: Cache<string>;

  beforeEach(() => {
    cache = new Cache<string>(1); // 1 second TTL for testing
  });

  it('should return null for missing keys', () => {
    expect(cache.get('missing')).toBeNull();
  });

  it('should store and retrieve values', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  it('should expire values after TTL', async () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');

    // Wait for TTL to expire
    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(cache.get('key1')).toBeNull();
  });

  it('should delete values', () => {
    cache.set('key1', 'value1');
    cache.delete('key1');
    expect(cache.get('key1')).toBeNull();
  });

  it('should clear all values', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.clear();
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBeNull();
  });

  it('should evict least recently used when at max size', () => {
    const smallCache = new Cache<string>(60, 2);
    smallCache.set('a', '1');
    smallCache.set('b', '2');
    // Access 'a' to make it most recently used
    smallCache.get('a');
    // Add new entry, should evict 'b' (least recently used)
    smallCache.set('c', '3');
    expect(smallCache.get('a')).toBe('1');
    expect(smallCache.get('b')).toBeNull();
    expect(smallCache.get('c')).toBe('3');
  });

  it('should update LRU on access', () => {
    const smallCache = new Cache<string>(60, 2);
    smallCache.set('a', '1');
    smallCache.set('b', '2');
    // Access 'a' to make it most recently used
    smallCache.get('a');
    // Add 'a' again - should not cause eviction
    smallCache.set('a', 'updated');
    smallCache.set('c', '3');
    expect(smallCache.get('a')).toBe('updated');
    expect(smallCache.get('b')).toBeNull();
    expect(smallCache.get('c')).toBe('3');
  });
});
