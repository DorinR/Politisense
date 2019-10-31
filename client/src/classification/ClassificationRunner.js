const Classifier = require('./Classifier').Classifier
const FireStore = require('../Firebase').FireStore

class ClassificationManager {
  constructor () {
    this.classifier = new Classifier()
  }

  load () {
    const fs = new FireStore()
    fs.Bill().select()
      .then(result => {
        result.forEach(doc => ({
         const {name, link} = doc.data()
        })
      })
      .catch(e => {
        console.log(e)
      })
  }
}

class ClassificationRunner {
  constructor () {
    this.manager = new ClassificationManager()
  }
}

module.exports.ClassificationRunner = ClassificationRunner

const fs = new FireStore()
fs.Bill().insert({
  name: 'Some act to do something',
  link: 'https://www.parl.ca/DocumentViewer/en/8707934?Language=E'
})

const test = new ClassificationManager()
test.load()
