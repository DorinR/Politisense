const AbstractJobAction = require('./JobAction').AbstractJobAction
const nfetch = require('node-fetch')

class PDFFileRetrieverAction extends AbstractJobAction {
  constructor (partialFp) {
    super()
    this.fp = partialFp
    this.send = nfetch
  }

  perform () {
    return new Promise((resolve, reject) => {
      this.fp = 'https://www.parl.ca' + this.fp.slice(0, this.fp.length)
      return this.send(this.fp)
        .then(this.createBufferFromResponse.bind(this))
        .then(this.formatBufferToUint8.bind(this))
        .then(resolve)
        .catch(reject)
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
