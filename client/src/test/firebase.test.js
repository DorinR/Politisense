const Firestore = require('../Firebase').Firestore

const chai = require('chai')
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)
// eslint-disable-next-line no-undef
describe('All firebase tests', () => {
  // eslint-disable-next-line no-undef
  test('Can insert and delete a record', () => {
    const fb = new Firestore()
    fb.Bill().insert({ id: 'a' }).should.eventually.be.a(true)
    fb.Bill().delete({ id: 'a' }).should.eventually.be.a(1)
    fb.close()
  })
  // eslint-disable-next-line no-undef
  test('can retrieve records', () => {
    const fb = new Firestore()
    fb.Bill().select().should.eventually.be.a('object')
    fb.close()
  })
  // eslint-disable-next-line no-undef
  test('can filter records (legacy)', () => {
    const fb = new Firestore()
    fb.Bill().select('id', '==', '2').should.eventually.be.a('object')
    fb.close()
  })
  // eslint-disable-next-line no-undef
  test('can filter records (use this)', () => {
    const fb = new Firestore()
    fb.Bill()
      .where('id', '==', '2')
      .select().should.eventually.be.a('object')
    fb.close()
  })
  // eslint-disable-next-line no-undef
  test('can update a record', () => {
    const fb = new Firestore()
    fb.Bill().insert({ id: '2' }).should.eventually.be.a(true)
    fb.Bill()
      .where('id', '==', '2')
      .update({ id: '3' }).should.eventually.be.a(1)
    fb.Bill()
      .where('id', '==', '3')
      .delete().should.eventually.be.a(1)
    fb.close()
  })
})
