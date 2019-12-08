const Firestore = require('../Firebase').Firestore

const chai = require('chai')
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)
/* eslint-env jest */
describe('All firebase tests', () => {
  let fb
  beforeAll(() => {
    fb = new Firestore()
  })

  afterAll(async () => {
    await fb.close()
  })

  test('Can insert and delete a record', () => {
    fb.Bill().insert({ id: 'a' }).should.eventually.be.a(true)
    fb.Bill()
      .where('id', '==', 'a')
      .delete().should.eventually.be.a(1)
  })

  test('can filter records (legacy)', () => {
    fb.Bill().select('id', '==', 8062279).should.eventually.be.a('object')
  })

  test('can filter records (use this)', () => {
    fb.Bill()
      .where('id', '==', 8062279)
      .select().should.eventually.be.a('object')
  })

  test('can update a record', () => {
    fb.Bill().insert({ id: '2' }).should.eventually.be.a(true)
    fb.Bill().insert({ id: '3' }).should.eventually.be.a(true)
    fb.Bill()
      .where('id', '==', '2')
      .update({ id: '3' }).should.eventually.be.a(1)
    fb.Bill()
      .where('id', '==', '3')
      .delete().should.eventually.be.a(2)
  })
})
