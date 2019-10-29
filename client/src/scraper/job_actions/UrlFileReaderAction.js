const fetch = require('node-fetch')
const JobAction = require('./JobAction').AbstractJobAction

class UrlFileReader extends JobAction {
  constructor (filepath) {
    super()
    this.fp = filepath
  }

  perform () {
    // eslint-disable-next-line no-undef
    return fetch(this.fp)
      .then((result) => {
        return result.text()
      })
      .then((body) => {
        return body
      })
      .then((body) => {
        console.log('Done Retrieving xml: ' + this.fp)
        return body
      })
      .catch((e) => {
        console.error(e.message)
        return this.fp
      })
  }
}

module.exports.FileReader = UrlFileReader
