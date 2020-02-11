const Queue = require('@queue').Queue
const Action = require('@manager').QueueAction
const DecorationError = require('@action').Errors.ActionDecorationError

class QueueManager {
  constructor (waitPeriod = 1000) {
    this.error = console.error
    this.log = (result) => {
      let message
      if (result instanceof Object) {
        message = `INFO: job finished, found ${result.data ? result.data.length : 0} potential results`
      } else {
        message = `INFO: job finished, found ${result ? result.length : 0} potential results`
      }
      console.log(message)
      return result
    }
    this.activeJobs = []
    this.activeJobCount = 0
    this.queue = new Queue()
    this.waitPeriod = waitPeriod
    this.result = []
  }

  start () {
    throw new DecorationError(null, 'Start action not specified')
  }

  stop () {
    throw new DecorationError(null, 'Stop action not specified')
  }

  async execute () {
    const partialResults = await this.start()
    this.accumulate(partialResults)
    await this.run()
    return this.result
  }

  requeueCallback (jobs) {
    jobs.forEach(job => {
      this.queue.enqueue(job)
    })
  }

  accumulate (result) {
    result.forEach(entry => {
      this.result.push(entry)
    })
    return result
  }

  setStartAction (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError(action)
    }
    this.start = action.perform.bind(action)
    return this
  }

  setErrorAction (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError(action)
    }
    this.error = action.perform.bind(action)
    return this
  }

  setLogAction (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError(action)
    }
    this.log = action.perform.bind(action)
    return this
  }

  setStopAction (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError(action)
    }
    this.stop = action.perform.bind(action)
    return this
  }

  async run () {
    while (!this.stop()) {
      let job = null
      try {
        job = this.queue.dequeue()
        this.activeJobs.push(job)
        this.activeJobCount++
      } catch (e) {
        await this.waitForActiveJobs(e)
        continue
      }
      job.execute()
        .then(this.accumulate.bind(this))
        .then(this.log)
        .catch(this.error)
        .finally(async () => {
          job.done = true
          this.activeJobCount--
          await this.waitForActiveJobs()
        })
    }
  }

  async waitForActiveJobs (e) {
    this.pruneCompletedJobs()
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
      if (this.activeJobs[currentIndex].done === true) {
        this.activeJobs.splice(currentIndex)
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
