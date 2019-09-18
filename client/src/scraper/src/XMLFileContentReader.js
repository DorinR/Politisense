const fetch = require('node-fetch')

class FileReader {
  constructor (filepath) {
    this.fp = filepath
  }

  read () {
    // eslint-disable-next-line no-undef
    return fetch(this.fp)
      .then((result) => {
        return result.text()
      })
      .then((body) => {
        return body
      })
      .catch((e) => {
        return this.fp
      })
  }
}

module.exports.Reader = FileReader
