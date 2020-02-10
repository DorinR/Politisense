const chai = require('chai')
const expect = chai.expect

const Condition = require('../../util/Condition').Condition

// eslint-disable-next-line no-undef
describe('All Condition tests', () => {
  // eslint-disable-next-line no-undef
  test('Condition Throws on type mismatch', () => {
    const cond = Condition.parameter(1)
    expect(() => {
      cond.isType(String)
    }).to.throw()
  })
  // eslint-disable-next-line no-undef
  test('Condition does not throw on type match', () => {
    const cond = Condition.parameter(1)
    expect(() => {
      cond.isType(Number)
    }).to.not.throw()
  })
})
