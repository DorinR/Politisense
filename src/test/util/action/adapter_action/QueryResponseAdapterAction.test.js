/* eslint-env jest */
const Action = require('../../../../util/action/actions').QueryResponseAdapterAction

const chai = require('chai')
const Assert = chai.assert

describe('QueryResponseAdapterAction.js', () => {
  let result
  let param
  beforeAll(() => {
    result = {
      selected: ['a', 'b', 'c'],
      other: ['d', 'e', 'f']
    }
    param = {
      bill: 'some bill',
      parliament: 42
    }
  })

  let undertest
  beforeEach(() => {
    undertest = new Action(param)
  })

  test('QueryResponseAdapterAction.js::perform returns object with correct format', async (done) => {
    const resp = await undertest.perform(result)
    Assert(resp instanceof Object)
    Assert.equal(resp.params, param)
    Assert.equal(resp.data, result)
    done()
  })
})
