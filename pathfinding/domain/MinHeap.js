// Binary min-heap keyed on a numeric priority. Equal priorities pop in
// insertion order (a sequence-number tiebreak, like Python's heapq with an
// itertools.count()), which keeps Dijkstra/A* exploration deterministic.
class MinHeap {
  constructor() {
    this._items = [];
    this._seq = 0;
  }

  get size() {
    return this._items.length;
  }

  push(priority, value) {
    this._items.push({ priority, seq: this._seq++, value });
    this._siftUp(this._items.length - 1);
  }

  // Returns {priority, value}; caller checks size first.
  pop() {
    const items = this._items;
    const top = items[0];
    const last = items.pop();
    if (items.length > 0) {
      items[0] = last;
      this._siftDown(0);
    }
    return { priority: top.priority, value: top.value };
  }

  _less(i, j) {
    const a = this._items[i];
    const b = this._items[j];
    return a.priority < b.priority || (a.priority === b.priority && a.seq < b.seq);
  }

  _swap(i, j) {
    [this._items[i], this._items[j]] = [this._items[j], this._items[i]];
  }

  _siftUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this._less(i, parent)) break;
      this._swap(i, parent);
      i = parent;
    }
  }

  _siftDown(i) {
    const n = this._items.length;
    for (;;) {
      const left = 2 * i + 1;
      const right = left + 1;
      let smallest = i;
      if (left < n && this._less(left, smallest)) smallest = left;
      if (right < n && this._less(right, smallest)) smallest = right;
      if (smallest === i) break;
      this._swap(i, smallest);
      i = smallest;
    }
  }
}

module.exports = MinHeap;
