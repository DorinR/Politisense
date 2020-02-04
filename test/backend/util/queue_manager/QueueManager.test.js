/* eslint-env jest */
const Utils = require('../../../../backend/util/utils')
const QueueManager = Utils.QueueManager.QueueManager
const Action = Utils.QueueManager.QueueAction
const Job = Utils.Job

const chai = require('chai')
const Assert = chai.assert

describe('QueueManager.js', () => {
  let undertest
  beforeEach(() => {
    undertest = new QueueManager()
  })

  test('QueueManager.js::start throws by default', async (done) => {
    try {
      undertest.start()
      Assert.fail()
    } catch (e) {
      if (!(e instanceof chai.AssertionError)) {
        Assert(true)
      } else {
        throw e
      }
    }
    done()
  })

  test('QueueManager.js::stop throws by default', async (done) => {
    try {
      undertest.stop()
      Assert.fail()
    } catch (e) {
      if (!(e instanceof chai.AssertionError)) {
        Assert(true)
      } else {
        throw e
      }
    }
    done()
  })

  test('QueueManager.js::wait creates blocking promise when awaited', async (done) => {
    await QueueManager.wait(1000)
      .then(() => {
        Assert(true)
      })
    done()
  }, 1500)

  test('QueueManager.js::requeueCallback places passed jobs into queue', async (done) => {
    Assert.equal(undertest.queue.size(), 0)
    undertest.requeueCallback([
      new Job(),
      new Job(),
      new Job()
    ])
    Assert.equal(undertest.queue.size(), 3)
    done()
  })

  test('QueueManager.js::accumulate aggregates results', async (done) => {
    Assert.equal(undertest.result.length, 0)
    undertest.accumulate([
      'result 1',
      'result 2',
      'result 3'
    ])
    Assert.equal(undertest.result.length, 3)
    undertest.accumulate([
      'result 4',
      'result 5',
      'result 6'
    ])
    Assert.equal(undertest.result.length, 6)
    done()
  })

  test('QueueManager.js::setStartAction throws when adding bad action', async (done) => {
    try {
      undertest.setStartAction({ thing: 'definitely not an ES6 job' })
      Assert.fail()
    } catch (e) {
      if (!(e instanceof chai.AssertionError)) {
        Assert(true)
      } else {
        throw e
      }
    }
    done()
  })

  test('QueueManager.js::setStartAction adds start action', async (done) => {
    Assert(typeof undertest.start === 'function')
    const action = new Action()
    let called = false
    action.perform = () => { called = true }

    undertest.setStartAction(action)
    Assert(typeof undertest.start === 'function')
    undertest.start()
    Assert(called)
    done()
  })

  test('QueueManager.js::setStopAction throws when adding bad action', async (done) => {
    try {
      undertest.setStopAction({ thing: 'definitely not an ES6 job' })
      Assert.fail()
    } catch (e) {
      if (!(e instanceof chai.AssertionError)) {
        Assert(true)
      } else {
        throw e
      }
    }
    done()
  })

  test('QueueManager.js::setStopAction adds stop action', async (done) => {
    Assert(typeof undertest.stop === 'function')
    const action = new Action()
    let called = false
    action.perform = () => { called = true }

    undertest.setStopAction(action)
    undertest.stop()
    Assert(typeof undertest.stop === 'function')
    Assert(called)
    done()
  })

  test('QueueManager.js::setLogAction throws when adding bad action', async (done) => {
    try {
      undertest.setLogAction({ thing: 'definitely not an ES6 job' })
      Assert.fail()
    } catch (e) {
      if (!(e instanceof chai.AssertionError)) {
        Assert(true)
      } else {
        throw e
      }
    }
    done()
  })

  test('QueueManager.js::setLogAction adds log action', async (done) => {
    Assert(typeof undertest.log === 'function')
    const action = new Action()
    let called = false
    action.perform = () => { called = true }

    undertest.setLogAction(action)
    undertest.log()

    Assert(typeof undertest.log === 'function')
    Assert(called)
    done()
  })

  test('QueueManager.js::setErrorAction throws when adding bad action', async (done) => {
    try {
      undertest.setErrorAction({ thing: 'definitely not an ES6 job' })
      Assert.fail()
    } catch (e) {
      if (!(e instanceof chai.AssertionError)) {
        Assert(true)
      } else {
        throw e
      }
    }
    done()
  })

  test('QueueManager.js::setErrorAction adds error action', async (done) => {
    Assert(typeof undertest.error === 'function')
    const action = new Action()
    let called = false
    action.perform = () => { called = true }

    undertest.setErrorAction(action)
    undertest.error()

    Assert(typeof undertest.error === 'function')
    Assert(called)
    done()
  })

  test('QueueManager.js', async (done) => {
    done()
  })
})
