const Firestore = require('../Firebase').Firestore

const chai = require('chai')
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)
var fb = new Firestore()
// eslint-disable-next-line no-undef
describe('All firebase tests', () => {
  // eslint-disable-next-line no-undef
  test('Can insert a record', () => {
    fb.Bill().insert({ id: 'a' }).should.eventually.be.a(true)
  })
  // eslint-disable-next-line no-undef
  test('can retrieve records', () => {
    fb.Bill().select().should.eventually.be.a('object')
  })
  // eslint-disable-next-line no-undef
  test('can filter records', () => {
    fb.Bill().select('id', '==', '2').should.eventually.be.a('object')
  })
})
