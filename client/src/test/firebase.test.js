import { describe } from 'mocha'

const Firestore = require('../Firebase').Firestore

const chai = require('chai')
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)
var fb = new Firestore()

describe('All firebase tests', () => {
  test('Can insert a record', () => {
    fb.Bill()
      .insert({ id: 'a' })
      .should.eventually.be.a(true)
  })

  test('can retrieve records', () => {
    fb.Bill()
      .select()
      .should.eventually.be.a('object')
  })

  test('can filter records', () => {
    fb.Bill()
      .select('id', '==', '2')
      .should.eventually.be.a('object')
  })
})
