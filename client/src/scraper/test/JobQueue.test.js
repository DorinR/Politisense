const Queue = require('../src/JobQueue')
const Scrape = require('../src/Scraper')
const assert = require('chai').assert
const expect = require('chai').expect

// eslint-disable-next-line no-undef
describe('All Request Queue tests', () => {
  // eslint-disable-next-line no-undef
  test('Can enqueue a Scrape Request', () => {
    const q = new Queue.JobQueue()
    q.enqueue(new Scrape.Scraper(''))
    assert.equal(q.size(), 1, 'There should only be one request in the queue')
  })
  // eslint-disable-next-line no-undef
  test('Can enqueue a Scrape Request', () => {
    const q = new Queue.JobQueue()
    q.enqueue(new Scrape.Scraper('a'))
    q.enqueue(new Scrape.Scraper(''))
    const req = q.dequeue()
    assert.equal(q.size(), 1, 'There should only be one request in the queue')
    assert.equal(req.url, 'a', 'incorrect request returned')
  })
  // eslint-disable-next-line no-undef
  test('Dequeue on empty list throws', () => {
    const q = new Queue.JobQueue()
    assert.equal(q.size(), 0, 'empty queue')
    const testFn = () => {
      q.dequeue()
    }
    expect(testFn).to.throw()
  })
})
