/* eslint-env jest */
const Action = require('../../../../util/action/actions').RoleQueryResponseAdapterAction

const chai = require('chai')
const Assert = chai.assert

describe('RoleQueryResponseAdapterAction.js', () => {
  let result
  let param
  beforeAll(() => {
    result = {
      associations: new Array(3).fill({}, 0, 3),
      committees: new Array(3).fill({}, 0, 3),
      parliamentaries: new Array(3).fill({}, 0, 3)
    }
    param = {
      id: 'some id',
      parliament: 42
    }
  })

  let undertest
  beforeEach(() => {
    undertest = new Action(param)
  })

  test('RoleQueryResponseAdapterAction.js::perform returns object with correct format', async (done) => {
    const resp = await undertest.perform(result)
    Assert(resp instanceof Object)
    Assert.isOk(resp.data)
    Assert.isOk(resp.params)
    Assert.equal(resp.params, param)
    Assert(
      resp.data.every(datum => {
        return datum instanceof Object && datum.politician === param.id
      })
    )
    done()
  })
})
