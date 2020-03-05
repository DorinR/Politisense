/* eslint-env jest */
const Action = require('../../../../util/action/actions').RoleFetchLinkAdapterAction
const RequestError = require('../../../../util/action/error/errors').RequestError
const chai = require('chai')
const Assert = chai.assert

describe('RoleFetchLinkAdapterAction.js', () => {
  let result
  let param
  beforeAll(() => {
    result = '/some-link-here'
    param = {
      bill: 'some bill',
      parliament: 42
    }
  })

  let undertest
  beforeEach(() => {
    undertest = new Action(param)
  })

  test('RoleFetchLinkAdapterAction.js::perform returns object with correct format', async (done) => {
    const resp = await undertest.perform(result)
    Assert(resp instanceof Object)
    Assert.equal(resp.url, `https://www.ourcommons.ca/some-link-here/roles/xml`)
    done()
  })

  test('RoleFetchLinkAdapterAction.js::perform throws when passed null', async (done) => {
    try {
      await undertest.perform()
      Assert.fail()
    } catch (e) {
      if (e instanceof chai.AssertionError) {
        throw e
      }
      if (!(e instanceof RequestError)) {
        Assert.fail()
      }
    }
    done()
  })
})