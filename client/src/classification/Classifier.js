const natural = require('natural')
const TfIdf = natural.TfIdf

class _Classifier {
  constructor (json = null) {
    if (json === null) {
      this.classifier = new TfIdf()
    } else {
      this.classifier = new TfIdf(JSON.parse(json))
    }
    this.documents = []
  }

  addDocument (name, contents) {
    this.documents.push(name)
    this.classifier.addDocument(contents, this.documents.length - 1, false)
  }

  getAllTermsForDocument (name) {
    const index = this.documents.indexOf(name)
    if (index !== -1) {
      return this.classifier.listTerms(index)
    } else {
      return null
    }
  }

  getAllTermsByDocuments () {
    const documents = new Map()
    let index = 0
    while (index < this.documents.length) {
      documents.set(this.documents[index], this.classifier.listTerms(index++))
    }
    return documents
  }

  save () {
    return JSON.stringify(this.classifier)
  }
}

class Classifier {
  constructor (json) {
    this.classifier = new _Classifier(json)
  }

  addDocument (name, content) {
    this.classifier.addDocument(name, content)
  }

  getAllTermsForDocument (name) {
    return this.classifier.getAllTermsForDocument(name)
  }

  getAllTermsByDocuments () {
    return this.classifier.getAllTermsByDocuments()
  }

  save () {
    return this.classifier.save()
  }

  load (json) {
    this.classifier = new _Classifier(json)
  }
}

module.exports.Classifier = Classifier
