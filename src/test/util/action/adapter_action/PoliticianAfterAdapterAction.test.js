/* eslint-env jest */
const Action = require('../../../../util/action/actions').PoliticianAfterAdapterAction

const chai = require('chai')
const Assert = chai.assert

describe('PoliticianAfterAdapterAction.js', () => {
  let result
  beforeAll(() => {
    result = {
      selected: ['a', 'b', 'c'],
      other: ['d', 'e', 'f']
    }
  })

  let undertest
  beforeEach(() => {
    undertest = new Action()
  })
  test('PoliticianAfterAdapterAction.js::perform returns object with correct format', async (done) => {
    const resp = await undertest.perform(result)
    Assert(resp instanceof Array)
    Assert.equal(resp.length, 3)
    for (let i = 0; i < result.selected.length; i++) {
      Assert.equal(resp[i], undertest.prefix + result.selected[i])
    }
    done()
  })
})
