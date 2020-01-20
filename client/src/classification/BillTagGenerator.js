const Firestore = require('../Firebase').Firestore
const BillClassification = require('../models/BillClassification').BillClassification
const fs = require('fs')

class BillTagGenerator {
  constructor (termThreshold = 0.1, tagThreshold = 1.25, clearCurrentTags = false) {
    this.termThreshold = termThreshold
    this.tagThreshold = tagThreshold
    this.clear = clearCurrentTags
  }

  async createTags () {
    if (this.clear) {
      await this.clearTagCollection()
    }
    const vocabs = this.loadVocabularies()
    const classifications = await this.loadRawClassifications()
      .then(this.filterRawByThreshold.bind(this))
      .catch(console.error)
    const tags = this.tagBills(classifications, vocabs)
    await this.insertTagsIntoDatabase(tags)
  }

  clearTagCollection () {
    return new Firestore()
      .BillClassification()
      .delete()
      .then(res => {
        console.log(`INFO: successfully removed ${res} bill tags from firestore`)
      })
  }

  loadRawClassifications () {
    return new Firestore().TfIdfClassification()
      .select()
      .then(raws => {
        const classifications = []
        raws.forEach(raw => {
          classifications.push({
            raw: raw.data().raw,
            bill: raw.data().bill,
            rawId: raw.id
          })
        })
        console.log(`INFO: successfully retrieved ${classifications.length} raw classifications`)
        return classifications
      })
      .catch(console.error)
  }

  filterRawByThreshold (tfidfs) {
    console.log('INFO: filtering out low quality terms...')
    const filtered = []
    tfidfs.forEach(tfidf => {
      const valuableTerms = { terms: {}, rawId: tfidf.rawId }
      Object.keys(tfidf.raw).forEach(term => {
        this.filterTermsByScore(tfidf, term, valuableTerms)
      })
      filtered.push({
        bill: tfidf.bill,
        classification: valuableTerms
      })
    })
    return filtered
  }

  filterTermsByScore (tfidf, term, valuableTerms) {
    if (tfidf.raw[term] > this.termThreshold) {
      valuableTerms.terms[term] = tfidf.raw[term]
    }
  }

  loadVocabularies () {
    console.log('INFO: loading vocabularies...')
    const dir = './vocabularies/'
    this.throwIfDoesNotExist(dir)
    let filenames = this.getFilesFromDirectory(dir)
    filenames = this.filterByExpectedFormat(filenames)
    const tags = this.createTagsFromFilenames(filenames)
    const files = this.retrieveFileContents(filenames, dir)
    return this.createReferenceVocabularies(files, tags)
  }

  throwIfDoesNotExist (directory) {
    if (!fs.existsSync(directory)) {
      throw new Error('ERROR: could not locate vocabularies directory')
    }
  }

  getFilesFromDirectory (directory) {
    let filenames = fs.readdirSync(directory)
    filenames = this.filterByExpectedFormat(filenames)
    return filenames
  }

  filterByExpectedFormat (filenames) {
    return filenames.filter(file => {
      return file.includes('vocab_') && file.includes('.txt')
    })
  }

  createTagsFromFilenames (filenames) {
    return filenames.map(file => {
      return file.slice(6, file.length - 4)
    })
  }

  retrieveFileContents (filenames, dir) {
    return filenames.map(f => {
      return fs.readFileSync(dir + f).toString().split('\n')
    })
  }

  createReferenceVocabularies (files, tags) {
    const vocabularies = []
    tags.forEach((tag, i) => {
      vocabularies.push({
        tag: tag,
        words: files[i]
      })
    })
    return vocabularies
  }

  tagBills (classifications, vocabs) {
    console.log('INFO: creating bill tags from classifications and vocabularies...')
    const billTags = []
    classifications.forEach(({ bill, classification }) => {
      vocabs.forEach(({ tag, words }) => {
        let vocabCount = 0
        words.forEach(word => {
          Object.keys(classification.terms).forEach(term => {
            if (term.includes(word)) {
              vocabCount++
            }
          })
        })
        if ((vocabCount / words.length) > this.tagThreshold) {
          const bc = new BillClassification(bill, classification.rawId, tag)
          billTags.push(bc)
        }
      })
    })
    console.log(`INFO: successfully created ${billTags.length} bill tags.`)
    return billTags
  }

  insertTagsIntoDatabase (tags) {
    return Promise.all(
      tags.map(tag => {
        new Firestore()
          .BillClassification()
          .insert(tag)
          .then(() => {
            console.log(`INFO: Bill tag: ${tag.category}, for bill: ${tag.bill}, was successfully inserted into firestore`)
          })
          .catch(console.error)
      })
    )
  }
}

module.exports.BillTagGenerator = BillTagGenerator
