
class Job {
  constructor (url, manager, topLevelDomains) {
    this.url = url
    this.manager = manager
    this.tlds = typeof topLevelDomains === 'undefined' ? ['https://www.ourcommons.ca', 'https://www.parl.ca'] : topLevelDomains
    this.initialiseJobComponents()
    this.done = false
  }

  initialiseJobComponents () {
    throw new TypeError('::initialiseJobComponents not implemented in derived class')
  }

  createNewJobs (urls) {
    const newJobs = []
    urls.forEach((url) => {
      newJobs.push(this.createNewJob(url, this.manager))
    })
    return newJobs
  }

  createNewJob (url, manager) {
    throw new TypeError('::createNewJob not implemented in derived class')
  }

  async execute () {
    throw new TypeError('::execute not implemented in derived class')
  }
}

module.exports.AbstractJob = Job
