const LinkedList = require('linked-list')

class Queue {
  constructor () {
    this.queue = new LinkedList()
  }

  enqueue (task) {
    const item = new LinkedList.Item()
    // eslint-disable-next-line dot-notation
    item['item'] = task
    this.queue.append(item)
  }

  dequeue () {
    if (this.size() < 1) {
      throw new RangeError('Empty Queue')
    }
    const head = this.queue.head
    head.detach()
    return head.item
  }

  size () {
    return this.queue.size
  }
}

module.exports.Queue = Queue
