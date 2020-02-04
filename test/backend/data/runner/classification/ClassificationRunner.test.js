const ClassificationRunner = require('@data/runner/classification').ClassificationRunner

const chai = require('chai')
const Assert = chai.assert
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)

// eslint-disable-next-line no-undef
describe('All Classifier tests', () => {
  // eslint-disable-next-line no-undef
  test('can init from firestore bills', () => {
    const test = new ClassificationRunner()
    test.createBillClassificationsFromFirestore(() => {
      Assert.isTrue(true)
    })
  })
  // eslint-disable-next-line no-undef
  test('can get all document classifiers', () => {
    const test = new ClassificationRunner()
    test.createBillClassificationsFromFirestore(() => {
      Assert.isTrue(typeof test.getClassifications(), 'map')
    })
  })
})
