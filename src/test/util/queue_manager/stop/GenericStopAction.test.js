/* eslint-env jest */
const StopAction = require('@manager').Stop.Generic
const chai = require('chai')
const Assert = chai.assert

describe('Generic.js', () => {
  let undertest
  beforeEach(() => {
    const manager = {
      result: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      queryCount: 0,
      lock: {
        acquire: () => {},
        release: () => {}
      }
    }
    undertest = new StopAction(manager)
  })

  test('Generic.js::perform returns true when num results is num queries', async (done) => {
    undertest.manager.queryCount = undertest.manager.result.length
    Assert(undertest.perform())
    done()
  })

  test('Generic.js::perform returns false when num results is less than num queries', async (done) => {
    undertest.manager.queryCount = undertest.manager.result.length - 4
    Assert(undertest.perform())
    done()
  })
})
