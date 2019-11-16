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
        return result.body()
      })
      .then((body) => {
        return body
      })
      .then(xml => {
        console.debug('Done Retrieving XML: ' + this.fp)
        return xml
      })
      .catch((e) => {
        e.message = 'unable to retrieve xml from link: ' + this.fp + '\n' + e.message
        return null
      })
  }
}
module.exports.FileReader = UrlFileReader
