const LinkedList = require('linked-list')

class UniqueJobQueue {
  constructor () {
    this.queue = new LinkedList()
    this.linkSet = new Set()
  }

  enqueue (task) {
    if (this.linkSet.has(task.scraper.url)) {
      throw new RangeError('URL already in UniqueJobQueue')
    }
    this.linkSet.add(task.scraper.url)
    const item = new LinkedList.Item()
    // eslint-disable-next-line dot-notation
    item['item'] = task
    this.queue.append(item)
  }

  dequeue () {
    if (this.size() < 1) {
      throw new RangeError('Empty UniqueJobQueue')
    }
    const head = this.queue.head
    head.detach()
    this.linkSet.delete(head.item.scraper.url)
    return head.item
  }

  size () {
    return this.queue.size
  }
}

module.exports.UniqueJobQueue = UniqueJobQueue
