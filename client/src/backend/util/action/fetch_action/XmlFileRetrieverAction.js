const fetch = require('node-fetch')
const Actions = require('../actions')
const JobAction = Actions.Action

class UrlFileReader extends JobAction {
  constructor (filepath) {
    super()
    this.fp = filepath
    this.send = fetch
  }

  perform () {
    // eslint-disable-next-line no-undef
    return this.send(this.fp)
      .then((result) => {
        return result.text()
      })
      .then((body) => {
        if (body.toLowerCase().includes('<!doctype html>')) {
          throw Error('Content not xml')
        }
        return body
      })
      .then(xml => {
        console.debug('Done Retrieving XML: ' + this.fp)
        return xml
      })
      .catch((e) => {
        e.message = 'unable to retrieve xml from link: ' + this.fp + '\n' + e.message
        console.debug(e.message)
        return null
      })
  }
}
module.exports.FileReader = UrlFileReader
