import { Firebase } from '../src/Firebase'

const chai = require('chai')
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)
// eslint-disable-next-line no-undef
describe('All firebase tests', () => {
  // eslint-disable-next-line no-undef
  test('Can insert a record', () => {
    const fb = new Firebase()
    fb.Bill().insert({ id: 'a' }).should.eventually.be(true)
    fb.close()
  })
  // eslint-disable-next-line no-undef
  test('can retrieve records', () => {
    const fb = new Firebase()
    return fb.Bill().select().should.eventually.return(chai.done)
  })
  // eslint-disable-next-line no-undef
  test('can filter records', () => {
    const fb = new Firebase()
    return fb.Bill().select({ id: 2 }).should.eventually.return(chai.done)
  })
})
