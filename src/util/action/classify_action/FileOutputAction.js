const Action = require('../JobAction').AbstractJobAction
const fs = require('fs')
const path = require('path')

class FileOutputAction extends Action {
  constructor (params) {
    super()
    this.params = params
  }

  perform (result) {
    const fp = path.join(__dirname, `${result.params.id}.json`)
    const out = JSON.stringify({
      name: result.params.id,
      content: result.data
    })
    return new Promise((resolve, reject) => {
      fs.writeFile(fp, Buffer.from(out), (err) => {
        if (err) {
          reject(err)
        }
        resolve({
          path: fp,
          parliament: result.params.parliament,
          id: result.params.id
        })
      })
    })
  }
}

module.exports.FileOutputAction = FileOutputAction
