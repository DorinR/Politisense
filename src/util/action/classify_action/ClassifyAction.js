const Action = require('../JobAction').AbstractJobAction
const proc = require('child_process')
const fs = require('fs')
const path = require('path')

class ClassificationAction extends Action {
  constructor (fp) {
    super()
    this.classifierPath = fp || path.join(__dirname, 'classifier.py')
  }

  async perform (billParams) {
    return this.addBillsToClassifier(billParams)
  }

  addBillsToClassifier (billParams) {
    const {
      execString,
      paths,
      params
    } = this.createExternalClassifierParameters(billParams)
    return this.runExternalClassifier(execString, paths, params)
  }

  createExternalClassifierParameters (billParams) {
    let execString = 'python3.7 ' + this.classifierPath
    const paths = []
    const params = []
    billParams.forEach(billParam => {
      paths.push(billParam.path)
      params.push({
        id: billParam.id,
        parliament: billParam.parliament
      })
      execString += ' ' + billParam.path
    })
    return { execString, paths, params }
  }

  runExternalClassifier (execString, paths, params) {
    return new Promise((resolve, reject) => {
      const child = proc.exec(execString)
      child.stdout.pipe(process.stdout)
      child.stderr.pipe(process.stderr)
      child.on('exit', code => {
        if (code === 0) {
          console.log(
            '--------------------------------------------------------------------------------------------------------'
          )
          console.log('INFO: successfully classified data')
          console.log(
            '--------------------------------------------------------------------------------------------------------'
          )
          const raws = this.readClassificationFile(
            path.join(__dirname, 'classifications.json')
          )
          const models = this.addToModels(raws, params)
          this.deleteTempFiles(paths)
          resolve(models)
        }
        reject(new Error(`ERROR: exited with nonzero status: ${code}`))
      })
    })
  }

  readClassificationFile (path) {
    const file = fs.readFileSync(path)
    return JSON.parse(file.toString())
  }

  addToModels (raws, bills) {
    const classifiedBills = []
    bills.forEach(({ id, parliament }) => {
      classifiedBills.push({
        bill: id,
        parliament: parliament,
        raw: raws[id]
      })
    })
    return classifiedBills
  }

  deleteTempFiles (files) {
    fs.unlinkSync(path.join(__dirname, 'classifications.json'))
    files.forEach(path => {
      console.debug(`INFO: deleting temporary file: ${path} on completion`)
      fs.unlinkSync(path)
    })
  }
}

module.exports.ClassificationAction = ClassificationAction
