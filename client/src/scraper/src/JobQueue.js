const LinkedList = require('linked-list')

class JobQueue {
  constructor () {
    this.queue = new LinkedList()
  }

  enqueue (scraper, parser, processor) {
    const item = new LinkedList.Item()
    // eslint-disable-next-line dot-notation
    item['scraper'] = scraper
    // eslint-disable-next-line dot-notation
    item['parser'] = parser
    // eslint-disable-next-line dot-notation
    item['processor'] = processor
    this.queue.append(item)
  }

  dequeue () {
    if (this.size() < 1) {
      throw new RangeError('Empty Queue')
    }
    const head = this.queue.head
    head.detach()
    return head.scraper
  }

  size () {
    return this.queue.size
  }
}
module.exports.JobQueue = JobQueue
