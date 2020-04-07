const Mutex = require('async-sema').Sema
const Queue = require('@queue').Queue
const Action = require('./QueueAction').QueueAction
const DecorationError = require('@action').Errors.ActionDecorationError

class QueueManager {
  constructor (waitPeriod = 1000) {
    this.error = console.error
    this.activeJobs = []
    this.activeJobCount = 0
    this.queue = new Queue()
    this.waitPeriod = waitPeriod
    this.result = []
    this.lock = new Mutex(1)
    this.registry = {}
  }

  start () {
    throw new DecorationError(null, 'Start action not specified')
  }

  stop () {
    throw new DecorationError(null, 'Stop action not specified')
  }

  before () {
    console.warn('Before action not specified')
  }

  after () {
    console.warn('After action not specified')
  }

  log (result) {
    return result
  }

  async execute () {
    await this.before()
    await this.start()
      .then(partialResults => {
        if (partialResults) {
          this.accumulate(partialResults)
        }
      })
    await this.run()
    await this.after()
    this.finish()
    return this.result
  }

  requeueCallback (jobs) {
    jobs.forEach(job => {
      this.queue.enqueue(job)
    })
  }

  accumulate (result) {
    if (result) {
      this.result.push(result)
    }
    return result
  }

  finish () {
    console.debug('WARN: No Finish Message Specified')
  }

  setStartAction (action) {
    QueueManager.check(action)
    this.start = action.perform.bind(action)
    this.registry.start = action.constructor.name
    return this
  }

  setErrorAction (action) {
    QueueManager.check(action)
    this.error = action.perform.bind(action)
    this.registry.error = action.constructor.name
    return this
  }

  setLogAction (action) {
    QueueManager.check(action)
    this.log = action.perform.bind(action)
    this.registry.log = action.constructor.name
    return this
  }

  setStopAction (action) {
    QueueManager.check(action)
    this.stop = action.perform.bind(action)
    this.registry.stop = action.constructor.name
    return this
  }

  setBeforeAction (action) {
    QueueManager.check(action)
    this.before = action.perform.bind(action)
    this.registry.before = action.constructor.name
    return this
  }

  setAfterAction (action) {
    QueueManager.check(action)
    this.after = action.perform.bind(action)
    this.registry.after = action.constructor.name
    return this
  }

  static check (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError(action)
    }
  }

  async run () {
    while (!await this.stop()) {
      let job = null
      try {
        await this.lock.acquire()
        job = this.queue.dequeue()
        this.activeJobs.push(job)
        this.activeJobCount++
        this.lock.release()
      } catch (e) {
        this.lock.release()
        await this.waitForActiveJobs(e)
        continue
      }
      this.runJob(job)
    }
    this.pruneCompletedJobs()
  }

  runJob (job) {
    return job.execute()
      .then(this.accumulate.bind(this))
      .then(this.log)
      .catch(this.error)
      .finally(async () => {
        await this.lock.acquire()
        job.done = true
        this.activeJobCount--
        this.lock.release()
        await this.waitForActiveJobs()
      })
  }

  async waitForActiveJobs (e) {
    await QueueManager.wait(this.waitPeriod)
    if (e) {
      console.debug(`INFO: ${e.message}, waiting for links to return..`)
    } else {
      console.debug('INFO: Job completed. waiting for links to return..')
    }
  }

  pruneCompletedJobs () {
    let currentIndex = 0
    while (currentIndex < this.activeJobs.length) {
      if (this.activeJobs[currentIndex].done === true && currentIndex !== 0) {
        this.activeJobs.splice(currentIndex)
      } else if (this.activeJobs[currentIndex].done === true && currentIndex === 0) {
        this.activeJobs.shift()
      } else {
        currentIndex++
      }
    }
  }

  static wait (ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }
}

module.exports.QueueManager = QueueManager
