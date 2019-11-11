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
        return result.body
      })
      .then((body) => {
        return body
      })
      .then((zipped) => {
        return zipped._outBuffer.toString()
      })
      .then(xml => {
        if (xml.includes('html')) {
          throw new Error('Content is not XML')
        }
        if (xml.includes('Content-Type:')) {
          xml = xml.body()
        }
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
