
class Job {
  constructor (url, callback) {
    this.url = url
    this.queueCallback = callback
    this.initialiseJobComponents()
    this.done = false
  }

  createNewJobs (urls) {
    const newJobs = []
    urls.forEach((url) => {
      newJobs.push(this.createNewJob(url, this.queueCallback))
    })
    return newJobs
  }

  initialiseJobComponents () {
    throw new TypeError('::initialiseJobComponents not implemented in derived class')
  }

  createNewJob (url, callback) {
    throw new TypeError('::createNewJob not implemented in derived class')
  }

  async execute () {
    throw new TypeError('::execute not implemented in derived class')
  }

  static connectionErrorName (message) {
    if (!message) {
      return null
    }

    if (message.includes('ESOCKETTIMEDOUT')) {
      return 'ESOCKETTIMEDOUT'
    }
    if (message.includes('ETIMEDOUT')) {
      return 'ETIMEDOUT'
    }
    if (message.includes('ECONNRESET')) {
      return 'ECONNRESET'
    }
    if (message.includes('EPIPE')) {
      return 'EPIPE'
    }
    if (message.includes('ENOTFOUND')) {
      return 'ENOTFOUND'
    }
    return null
  }
}

module.exports.AbstractJob = Job
