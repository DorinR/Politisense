const requestFn = require('axios')
const JobAction = require('../JobAction').AbstractJobAction
const RequestError = require('../error/errors').ScrapeError

class FetchAction extends JobAction {
  static headers () {
    return {
      Accept: '*/*',
      'User-Agent': 'PolitisenseScraper/0.1'
    }
  }

  constructor (params) {
    super()
    this.send = requestFn
    if (!params.url) {
      throw new Error()
    }
    if (!params.method) {
      params.method = 'GET'
    }
    params.method = params.method.toUpperCase()

    this.params = {
      url: params.url,
      method: params.method,
      timeout: 60000,
      followAllRedirects: true,
      resolveWithFullResponse: true,
      headers: FetchAction.headers()
    }

    if (params.method === 'GET') {
      this.params.params = params.params
    } else {
      this.params.data = params.params
    }
  }

  async perform (params) {
    if (params) {
      this.params = params
    }

    return new Promise((resolve, reject) => {
      this.send(this.params)
        .then(this.logResult.bind(this))
        .then(resolve)
        .catch((e) => {
          const error = new RequestError(e.message, this.params.url)
          error.stack = e.stack
          error.params = this.params
          reject(error)
        })
    })
  }

  logResult (resp) {
    console.debug(`Done Fetching: ${this.params.url}`)
    return resp.data
  }
}

module.exports.FetchAction = FetchAction
