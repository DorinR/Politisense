/* eslint-env jest */
const StopAction = require('@manager').Stop.GenericStopAction
const chai = require('chai')
const Assert = chai.assert

describe('GenericStopAction.js', () => {
  let undertest
  beforeEach(() => {
    const manager = {
      result: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      queryCount: 0
    }
    undertest = new StopAction(manager)
  })

  test('GenericStopAction.js::perform returns true when num results is num queries', async (done) => {
    undertest.manager.queryCount = undertest.manager.result.length
    Assert(undertest.perform())
    done()
  })

  test('GenericStopAction.js::perform returns false when num results is less than num queries', async (done) => {
    undertest.manager.queryCount = undertest.manager.result.length - 4
    Assert(undertest.perform())
    done()
  })
})
