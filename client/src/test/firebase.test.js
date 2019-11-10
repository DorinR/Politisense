const Firestore = require('../Firebase').Firestore

const chai = require('chai')
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)

// eslint-disable-next-line no-undef
describe('All firebase tests', () => {
  // eslint-disable-next-line no-undef
  test('Can insert a record', () => {
    let fb = new Firestore()
    fb.Bill().insert({ id: 'a' }).should.eventually.be.a(true)
    fb = null
  })
  // eslint-disable-next-line no-undef
  test('can retrieve records', () => {
    let fb = new Firestore()
    fb.Bill().select().should.eventually.be.a('object')
    fb = null
  })
  // eslint-disable-next-line no-undef
  test('can filter records', () => {
    let fb = new Firestore()
    fb.Bill().select('id', '==', '2').should.eventually.be.a('object')
    fb = null
  })
})
