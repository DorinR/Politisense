/* eslint-env jest */
const QueueManager = require('../../../util/queue_manager/QueueManager').QueueManager
const Action = require('../../../util/queue_manager/QueueAction').QueueAction
const Job = require('../../../job/Job').AbstractJob

const chai = require('chai')
const Assert = chai.assert

describe('QueueManager.js', () => {
  const consoleDebug = console.debug
  const consoleWarn = console.warn
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
    // eslint-disable-next-line no-new
    undertest.requeueCallback([new Job(), new Job(), new Job()
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
    Assert.equal(undertest.result.length, 1)
    undertest.accumulate([
      'result 4',
      'result 5',
      'result 6'
    ])
    Assert.equal(undertest.result.length, 2)
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

  test('QueueManager.js::log returns result when not specified', async (done) => {
    const req = 'ping'
    const resp = undertest.log(req)
    Assert.equal(resp, req)
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

  test('QueueManager.js::setBeforeAction throws when adding bad action', async (done) => {
    try {
      undertest.setBeforeAction({ thing: 'definitely not an ES6 job' })
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

  test('QueueManager.js::setBeforeAction set precondition action', async (done) => {
    Assert(typeof undertest.log === 'function')
    const action = new Action()
    let called = false
    action.perform = () => { called = true }

    undertest.setBeforeAction(action)
    undertest.before()

    Assert(typeof undertest.log === 'function')
    Assert(called)
    done()
  })

  test('QueueManager.js::setAfterAction throws when adding bad action', async (done) => {
    try {
      undertest.setAfterAction({ thing: 'definitely not an ES6 job' })
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

  test('QueueManager.js::setAfterAction sets postcondition action ', async (done) => {
    Assert(typeof undertest.log === 'function')
    const action = new Action()
    let called = false
    action.perform = () => { called = true }

    undertest.setAfterAction(action)
    await undertest.after()

    Assert(typeof undertest.log === 'function')
    Assert(called)
    done()
  })

  test('QueueManager.js::before prints to log when no action is set', async (done) => {
    let called = false
    console.warn = () => { called = true }
    await undertest.before()
    console.warn = consoleWarn
    Assert(called)
    done()
  })

  test('QueueManager.js::after prints to log when no action is set', async (done) => {
    let called = false
    console.warn = () => { called = true }
    await undertest.after()
    console.warn = consoleWarn
    Assert(called)
    done()
  })

  test('QueueManager.js::pruneCompletedJobs enables GC for done Jobs (first job case)', async (done) => {
    const isDone = new Job()
    isDone.done = true
    const notDone = new Job()
    undertest.activeJobs.push(isDone)
    undertest.activeJobs.push(notDone)
    Assert.equal(undertest.activeJobs.length, 2)
    undertest.pruneCompletedJobs()
    Assert.equal(undertest.activeJobs.length, 1)
    undertest.activeJobs.forEach(j => {
      Assert(!j.done)
    })
    done()
  })

  test('QueueManager.js::pruneCompletedJobs enables GC for done Jobs (other job case)', async (done) => {
    const isDone = new Job()
    isDone.done = true
    const notDone = new Job()
    undertest.activeJobs.push(notDone)
    undertest.activeJobs.push(isDone)
    Assert.equal(undertest.activeJobs.length, 2)
    undertest.pruneCompletedJobs()
    Assert.equal(undertest.activeJobs.length, 1)
    undertest.activeJobs.forEach(j => {
      Assert(!j.done)
    })
    done()
  })

  test('QueueManager.js::waitForActiveJobs prunes completed jobs', async (done) => {
    let called = false
    undertest.pruneCompletedJobs = () => { called = true }
    await undertest.waitForActiveJobs()
    Assert(called)
    done()
  })

  test('QueueManager.js::waitForActiveJobs waits to yield cycles', async (done) => {
    let called = false
    QueueManager.wait = () => { called = true }
    await undertest.waitForActiveJobs()
    Assert(called)
    done()
  })

  test('QueueManager.js::waitForActiveJobs writes a message to log', async (done) => {
    let called = false
    console.debug = () => { called = true }
    await undertest.waitForActiveJobs(new Error())
    Assert(called)
    called = false
    await undertest.waitForActiveJobs()
    Assert(called)
    console.debug = consoleDebug
    done()
  })

  test('QueueManager.js::run dequeues all waiting jobs and runs them until stop condition is met', async (done) => {
    let executedCount = 0
    const jobs = new Array(10)
      .fill({}, 0, 10)
      .map(obj => {
        const j = new Job()
        j.execute = async () => { executedCount++ }
        return j
      })

    undertest.stop = () => { return executedCount === jobs.length }

    undertest.requeueCallback(jobs)
    Assert.equal(undertest.queue.size(), jobs.length)

    await undertest.run()
    Assert.equal(executedCount, 10)
    done()
  }, 60000)

  test('QueueManager.js::run waits on empty queue', async (done) => {
    let called = false
    undertest.waitForActiveJobs = async () => { called = true }
    undertest.stop = () => { return called }

    await undertest.run()

    Assert(called)
    done()
  }, 60000)

  test('QueueManager.js::execute runs before, start, run, after in order', async (done) => {
    const order = []
    const desired = ['before', 'start', 'run', 'after']
    undertest.before = async () => { order.push(desired[0]) }
    undertest.start = async () => { order.push(desired[1]) }
    undertest.run = async () => { order.push(desired[2]) }
    undertest.after = async () => { order.push(desired[3]) }

    await undertest.execute()
    for (let i = 0; i < desired.length; i++) {
      Assert.equal(order[i], desired[i])
    }

    done()
  })

  test('QueueManager.js::execute can add results to queue from start', async (done) => {
    const order = []
    const desired = ['before', 'start', 'run', 'after']
    undertest.before = async () => { order.push(desired[0]) }
    undertest.start = async () => {
      order.push(desired[1])
      return ['res1', 'res2']
    }
    undertest.run = async () => { order.push(desired[2]) }
    undertest.after = async () => { order.push(desired[3]) }

    await undertest.execute()
    for (let i = 0; i < desired.length; i++) {
      Assert.equal(order[i], desired[i])
    }
    Assert.equal(undertest.result.length, 1)

    done()
  })
})
