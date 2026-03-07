interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

interface LRUNode<K, V> {
  key: K;
  value: V;
  prev?: LRUNode<K, V>;
  next?: LRUNode<K, V>;
}

export class Cache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  // LRU tracking - head is most recently used, tail is least recently used
  private lruHead?: LRUNode<string, T>;
  private lruTail?: LRUNode<string, T>;
  private lruMap: Map<string, LRUNode<string, T>> = new Map();

  constructor(
    private ttlSeconds = 3600,
    private maxSize = 100,
  ) {}

  private moveToHead(node: LRUNode<string, T>): void {
    // Remove from current position
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }

    // If node was head, update head
    if (node === this.lruHead) {
      this.lruHead = node.next;
    }
    // If node was tail, update tail
    if (node === this.lruTail) {
      this.lruTail = node.prev;
    }

    // Add to head
    node.prev = undefined;
    node.next = this.lruHead;
    if (this.lruHead) {
      this.lruHead.prev = node;
    }
    this.lruHead = node;

    // If tail is undefined, set it to head
    if (!this.lruTail) {
      this.lruTail = node;
    }
  }

  private removeTail(): void {
    if (!this.lruTail) return;

    const tail = this.lruTail;
    this.cache.delete(tail.key);
    this.lruMap.delete(tail.key);

    if (tail.prev) {
      tail.prev.next = undefined;
      this.lruTail = tail.prev;
    } else {
      // Tail was also head
      this.lruHead = undefined;
      this.lruTail = undefined;
    }
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      // Remove from LRU
      const lruNode = this.lruMap.get(key);
      if (lruNode) {
        this.removeLRUNode(lruNode);
      }
      return null;
    }

    // Update LRU - move to head
    const node = this.lruMap.get(key);
    if (node) {
      this.moveToHead(node);
    }

    return entry.value;
  }

  set(key: string, value: T): void {
    // Check if key exists
    const existing = this.cache.get(key);

    if (existing) {
      // Update existing entry
      existing.value = value;
      existing.expiresAt = Date.now() + this.ttlSeconds * 1000;
      // Move to head in LRU
      const node = this.lruMap.get(key);
      if (node) {
        this.moveToHead(node);
      }
      return;
    }

    // Evict if at max size
    while (this.cache.size >= this.maxSize && this.lruTail) {
      this.removeTail();
    }

    // Add new entry
    const expiresAt = Date.now() + this.ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });

    // Add to LRU
    const node: LRUNode<string, T> = { key, value };
    this.lruMap.set(key, node);
    this.moveToHead(node);
  }

  clear(): void {
    this.cache.clear();
    this.lruHead = undefined;
    this.lruTail = undefined;
    this.lruMap.clear();
  }

  delete(key: string): void {
    const node = this.lruMap.get(key);
    if (node) {
      this.removeLRUNode(node);
    }
    this.cache.delete(key);
  }

  private removeLRUNode(node: LRUNode<string, T>): void {
    // Remove from linked list
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
    if (node === this.lruHead) {
      this.lruHead = node.next;
    }
    if (node === this.lruTail) {
      this.lruTail = node.prev;
    }
    this.lruMap.delete(node.key);
  }
}
