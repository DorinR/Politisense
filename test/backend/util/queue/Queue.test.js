/* eslint-env jest */
const Utils = require('@utils')
const Queue = Utils.Queues.Queue
const ScrapeJob = require('@jobs').ScrapeJob

const assert = require('chai').assert
const expect = require('chai').expect

describe('Queue.js', () => {
  test('Queue::enqueue() adds one job to queue', () => {
    const q = new Queue()
    q.enqueue(new ScrapeJob())
    assert.equal(q.size(), 1, 'There should only be one Job in the queue')
  })

  test('Queue::dequeue() removes one job from queue', () => {
    const q = new Queue()
    q.enqueue(new ScrapeJob())
    q.enqueue(new ScrapeJob('a'))
    q.dequeue()
    assert.equal(q.size(), 1, 'There should only be one Job in the queue')
  })

  test('Queue::dequeue() throws when empty', () => {
    const q = new Queue()
    assert.equal(q.size(), 0, 'empty queue')
    const testFn = () => {
      q.dequeue()
    }
    expect(testFn).to.throw()
  })
})
