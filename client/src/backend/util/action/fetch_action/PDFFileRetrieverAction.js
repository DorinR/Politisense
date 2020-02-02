const nfetch = require('node-fetch')
const Actions = require('../actions')
const JobAction = Actions.Action


class PDFFileRetrieverAction extends JobAction {
  constructor (partialFp, bill) {
    super()
    this.fp = partialFp
    this.send = nfetch
    this.bill = bill
  }

  perform () {
    return new Promise((resolve, reject) => {
      this.fp = 'https://www.parl.ca' + this.fp.slice(0, this.fp.length)
      return this.send(this.fp)
        .then(this.createBufferFromResponse.bind(this))
        .then(this.formatBufferToUint8.bind(this))
        .then(resolve)
        .catch(e => {
          e.bill = this.bill
          e.url = this.fp
          reject(e)
        })
    })
  }

  createBufferFromResponse (response) {
    console.debug(`INFO: PDF retrieved from: ${this.fp}`)
    return response.buffer()
  }

  formatBufferToUint8 (buffer) {
    return Uint8Array.from(buffer)
  }
}

module.exports.PDFFileRetrieverAction = PDFFileRetrieverAction
