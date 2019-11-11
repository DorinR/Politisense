const Classifier = require('../../classification/Classifier').Classifier

const chai = require('chai')
const Assert = chai.assert

// eslint-disable-next-line no-undef
describe('All Classifier tests', () => {
  // eslint-disable-next-line no-undef
  test('Can add document', () => {
    const test = new Classifier()
    test.addDocument('name', 'content')
    Assert.equal(test.classifier.documents.length, 1)
  })
  // eslint-disable-next-line no-undef
  test('can get classification for document', () => {
    const test = new Classifier()
    test.addDocument('name', 'content')
    Assert.equal(test.classifier.documents.length, 1)
    const res = test.getAllTermsForDocument('name')
    Assert.equal(typeof res, 'object')
  })
  // eslint-disable-next-line no-undef
  test('can get all document classifiers', () => {
    const test = new Classifier()
    test.addDocument('name', 'content')
    test.addDocument('other name', 'content')
    Assert.equal(test.classifier.documents.length, 2)
    const res = test.getAllTermsByDocuments()
    Assert.equal(typeof res, 'object')
  })
  // eslint-disable-next-line no-undef
  test('saving returns string', () => {
    const test = new Classifier()
    test.addDocument('name', 'content')
    test.addDocument('other name', 'content')
    Assert.equal(test.classifier.documents.length, 2)
    const res = test.save()
    Assert.equal(typeof res, 'string')
  })

  // eslint-disable-next-line no-undef
  test('can load after saving', () => {
    let test = new Classifier()
    test.addDocument('name', 'content')
    test.addDocument('other name', 'content')
    Assert.equal(test.classifier.documents.length, 2)
    const saveString = test.save()
    Assert.equal(typeof saveString, 'string')
    test = null
    test = new Classifier(saveString)
    const nextSaveString = test.save()
    Assert.equal(saveString, nextSaveString)
  })
})
