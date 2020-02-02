const Utils = require('./utils')
const Queue = Utils.Queues.Queue
const Action = Utils.Actions.Action
const DecorationError = Utils.Actions.Errors.ActionDecorationError

class QueueManager {
  constructor (waitPeriod = 1000) {
    this.start = () => {
      throw new DecorationError(null, 'Start action not specified')
    }
    this.error = console.error
    this.log = (result) => {
      console.log(result.length)
      return result
    }
    this.stop = () => {
      throw new DecorationError(null, 'Stop action not specified')
    }
    this.activeJobs = []
    this.activeJobCount = 0
    this.queue = new Queue()
    this.waitPeriod = waitPeriod
    this.result = []
  }

  async execute () {
    await this.start()
    await this.run()
    return this.result
  }

  requeueCallback (jobs) {
    jobs.forEach(job => {
      this.queue.enqueue(job)
    })
  }

  accumulate(result) {
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
  }

  setErrorAction (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError(action)
    }
    this.error = action.perform.bind(action)
  }

  setLogAction (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError(action)
    }
    this.log = action.perform.bind(action)
  }

  setStopAction (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError(action)
    }
    this.stop = action.perform.bind(action)
  }

  async run () {
    while (!this.stop()) {
      let job = null
      try {
        job = this.queue.dequeue()
        this.activeJobs.push(job)
      } catch (e) {
        await this.waitForActiveJobs(e)
        continue
      }
      job.execute()
        .then(this.accumulate.bind(this))
        .then(this.log)
        .catch(this.error)
        .finally(async () => {
          this.activeJobCount--
          await this.waitForActiveJobs()
        })
    }
  }

  async waitForActiveJobs (e) {
    if (e) {
      console.debug(`INFO: ${e.message}, waiting for links to return..`)
    } else {
      console.debug('INFO: Job completed. waiting for links to return..')
    }
    this.pruneCompletedJobs()
    await QueueManager.wait(this.waitPeriod)
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
