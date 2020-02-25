/* eslint-env jest */
const Utils = require('../../../util/utils')
const Queue = Utils.Queues.UniqueJobQueue
const ScrapeJob = require('../../../job/jobs').ScrapeJob

const assert = require('chai').assert
const expect = require('chai').expect

describe('UniqueJobQueue.js', () => {
  test('UniqueJobQueue::enqueue() adds one job to queue', () => {
    const q = new Queue()
    q.enqueue(new ScrapeJob('', () => {}, []))
    assert.equal(q.size(), 1, 'There should only be one Job in the queue')
  })

  test('UniqueJobQueue::dequeue() removes one job from queue', () => {
    const q = new Queue()
    q.enqueue(new ScrapeJob('', () => {}, []))
    q.enqueue(new ScrapeJob('a', () => {}, []))
    q.dequeue()
    assert.equal(q.size(), 1, 'There should only be one Job in the queue')
  })

  test('UniqueJobQueue::enqueue() throws when enqueuing same job', () => {
    const q = new Queue()
    q.enqueue(new ScrapeJob('', () => {}, []))
    const testFn = () => {
      q.enqueue(new ScrapeJob('', () => {}, []))
    }
    expect(testFn).to.throw()
  })

  test('UniqueJobQueue::dequeue() throws when empty', () => {
    const q = new Queue()
    assert.equal(q.size(), 0, 'empty queue')
    const testFn = () => {
      q.dequeue()
    }
    expect(testFn).to.throw()
  })
})
