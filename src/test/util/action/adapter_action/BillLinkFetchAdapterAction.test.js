/* eslint-env jest */
const Action = require('../../../../util/action/actions').BillLinkFetchAdapterAction

const chai = require('chai')
const Assert = chai.assert

describe('BillLinkFetchAdapterAction.js', () => {
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

  test('BillLinkFetchAdapterAction.js::perform returns object with correct format', async (done) => {
    const resp = await undertest.perform(result)
    Assert(resp instanceof Object)
    Assert.isOk(resp.url)
    Assert.equal(resp.url, result.selected[0])
    Assert.isOk(resp.id, param.bill)
    Assert.isOk(resp.parliament, param.parliament)
    done()
  })
})
