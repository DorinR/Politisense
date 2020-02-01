const Firestore = require('../Firebase').Firestore
const ScrapeError = require('../scraper/job_actions/LinkScraperAction').ScrapeError
const PDFParseError = require('../scraper/job_actions/HandleDownloadErrorAction').PDFParseError
const BillFinder = require('./BillPDFFinderJob').BillPDFFinderJob
const BillParser = require('./PDFRetrievalJob').PDFRetrievalJob
const Queue = require('../scraper/utilities/Queue').Queue
const proc = require('child_process')
const fs = require('fs')

class ClassificationManager {
  constructor () {
    this.billLinksRemaining = 0
    this.billsToParse = 0
    this.finderQueue = new Queue()
    this.parserQueue = new Queue()
    this.jobs = []
    this.classifierPath = 'classifier.py'
  }

  static hold (ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  async createFromBillLinks () {
    const content = await this.fetchBillData()
    this.createFinderJobs(content)
    this.findPDFLinks()
    const billContent = await this.parsePDFContent()
    this.finderQueue = null
    this.parserQueue = null
    this.jobs = null
    return this.addBillsToClassifier(billContent)
  }

  async fetchBillData () {
    const content = await new Firestore().Bill()
      .select()
      .then(this.getBillLinks.bind(this))
      .catch(console.error)
    console.log(`INFO: ${content.length} bills have been retrieved`)
    return content
  }

  getBillLinks (documents) {
    const data = []
    this.billLinksRemaining = documents.size
    documents.forEach(doc => {
      data.push({
        id: doc.id,
        link: doc.data().link
      })
    })
    return data
  }

  createFinderJobs (data) {
    data.forEach(datum => {
      this.finderQueue.enqueue(BillFinder.create(datum.link, datum.id, this.finderQueueCb.bind(this)))
    })
  }

  finderQueueCb (newJobs) {
    newJobs.forEach(job => {
      console.log(`INFO: Re-enqueuing finder job: ${job.url}`)
      this.finderQueue.enqueue(job)
    })
  }

  findPDFLinks () {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      while (this.billLinksRemaining > 0) {
        let job = null
        try {
          job = this.finderQueue.dequeue()
          this.jobs.push(job)
        } catch (e) {
          console.debug(`INFO: waiting for ${this.billLinksRemaining} bills to be retrieved`)
          this.pruneCompletedJobs()
          await ClassificationManager.hold(10000)
          continue
        }
        job.execute()
          .then(this.enqueueBillContent.bind(this))
          .catch(this.handleScrapeErrors.bind(this))
          .finally(() => {
            job.done = true
          })
      }
      console.log('--------------------------------------------------------------------------------------------------------')
      console.log('INFO: All bills finished being retrieved')
      console.log('--------------------------------------------------------------------------------------------------------')
      resolve(true)
    })
  }

  enqueueBillContent (content) {
    if(!content) {
      return null
    }
    console.log(`INFO: waiting for ${--this.billLinksRemaining} bills to finish retrieval`)
    console.log(`INFO: waiting for ${++this.billsToParse} bills to be parsed`)
    this.parserQueue.enqueue(BillParser.create(content.link, content.id, this.parserQueueCb.bind(this)))
  }

  parserQueueCb (newJobs) {
    newJobs.forEach(job => {
      console.log(`INFO: Re-enqueuing parser job: ${job.url}`)
      this.parserQueue.enqueue(job)
    })
  }

  handleScrapeErrors (e) {
    if (e.name !== new ScrapeError().name ||
      (e.message && e.message.includes('Malformed'))) {
      console.log(`INFO: waiting for ${--this.billLinksRemaining} bills to finish retrieval`)
      console.error(e.message)
    }
  }

  pruneCompletedJobs () {
    let currentIndex = 0
    while (currentIndex < this.jobs.length) {
      if (this.jobs[currentIndex].done === true) {
        this.jobs.splice(currentIndex)
      } else {
        currentIndex++
      }
    }
  }

  parsePDFContent () {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      const content = []
      while (this.billLinksRemaining > 0 || this.billsToParse > 0) {
        let job = null
        try {
          job = this.parserQueue.dequeue()
          this.jobs.push(job)
        } catch (e) {
          console.debug(`INFO: waiting for ${this.billsToParse} bills to be parsed`)
          this.pruneCompletedJobs()
          await ClassificationManager.hold(10000)
          continue
        }
        job.execute()
          .then(this.logRetrievalSuccess.bind(this))
          .then(content.push.bind(content))
          .catch(this.handleParseErrors.bind(this))
          .finally(() => {
            job.done = true
          })
      }
      console.log('--------------------------------------------------------------------------------------------------------')
      console.log('INFO: All bills finished being parsed')
      console.log('--------------------------------------------------------------------------------------------------------')
      resolve(content)
    })
  }

  handleParseErrors (e) {
    if (e.name === new PDFParseError().name) {
      console.warn(`WARN: ${e.message}`)
    } else if (e.name !== new ScrapeError().name) {
      console.log(`INFO: waiting for ${--this.billsToParse} bills to be parsed`)
      console.error(`ERROR: could not parse a PDF for bill ${e.bill}: ${e.message}`)
      console.error(e.stack)
    }
  }

  logRetrievalSuccess (content) {
    console.debug(`INFO: waiting for ${--this.billsToParse} bills to be parsed`)
    console.log(`INFO: done getting bill PDF for: ${content.name}`)
    return content
  }

  addBillsToClassifier (billContents) {
    const { execString, paths, bills } = this.createExternalClassifierParameters(billContents)
    return this.runExternalClassifier(execString, paths, bills)
  }

  createExternalClassifierParameters (billContents) {
    let execString = 'python3.7 ' + this.classifierPath
    const paths = []
    const bills = []
    billContents.forEach((billContent, i) => {
      const path = this.createTempFile(i, billContent)
      paths.push(path)
      bills.push(billContent.name)
      execString += ' ' + path
    })
    return { execString, paths, bills }
  }

  createTempFile (index, content) {
    const path = `${index}.json`
    const out = JSON.stringify(content)
    fs.writeFileSync(path, out)
    return path
  }

  runExternalClassifier (execString, paths, bills) {
    return new Promise((resolve, reject) => {
      const child = proc.exec(execString)
      child.stdout.pipe(process.stdout)
      child.stderr.pipe(process.stderr)
      child.on('exit', (code) => {
        if (code === 0) {
          console.log('--------------------------------------------------------------------------------------------------------')
          console.log('INFO: successfully classified data')
          console.log('--------------------------------------------------------------------------------------------------------')
          const raws = this.readClassificationFile('classifications.json')
          const models = this.addToModels(raws, bills)
          this.deleteTempFiles(paths)
          resolve(models)
        }
        reject(new Error('ERROR: exited with nonzero status'))
      })
    })
  }

  readClassificationFile (path) {
    const file = fs.readFileSync(path)
    return JSON.parse(file.toString())
  }

  addToModels (raws, bills) {
    const classifiedBills = []
    bills.forEach(id => {
      classifiedBills.push({
        bill: id,
        raw: raws[id]
      })
    })
    return classifiedBills
  }

  deleteTempFiles (files) {
    fs.unlinkSync('classifications.json')
    files.forEach(path => {
      console.debug(`INFO: deleting temporary file: ${path} on completion`)
      fs.unlinkSync(path)
    })
  }
}

class ClassificationRunner {
  constructor (path) {
    this.manager = new ClassificationManager()
    if (path) {
      this.manager.classifierPath = path
    }
  }

  async createBillClassificationsFromFirestore () {
    const ret = await this.manager.createFromBillLinks()
    console.log('--------------------------------------------------------------------------------------------------------')
    console.log('INFO: Finished Fetching Bill Data and classification')
    console.log('--------------------------------------------------------------------------------------------------------')
    return ret
  }
}

module.exports.ClassificationRunner = ClassificationRunner

// new Firestore().TfIdfClassification()
//   .delete()
//   .then(async resp => {
//     console.log(`Deleted ${resp} documents`)
//     const test = new ClassificationRunner()
//     const classifications = await test.createBillClassificationsFromFirestore()
//     console.log(`Attempting to store ${classifications.length} raw bill classifications`)
//     await Promise.all(
//       classifications.map(raw => {
//         return new Firestore()
//           .TfIdfClassification()
//           .insert(raw)
//       })
//     )
//   })

new ClassificationRunner()
  .createBillClassificationsFromFirestore()
  .then(ret => {
    console.log(ret)
  })