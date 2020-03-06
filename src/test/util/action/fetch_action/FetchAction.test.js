const Action = require('../../../../util/action/fetch_action/FetchAction').FetchAction
const RequestError = require('../../../../util/action/error/errors').ScrapeError

const chai = require('chai')
const Assert = chai.assert

describe('FetchAction.js', () => {

  let param
  beforeAll(() => {
    param = {
      parliament:42
    }
  })

  test('FetchAction.js constructor throws on bad params', async(done) => {
    Assert.throws(() => {
      //eslint-disable-next-line no-new
      new Action({})
    })
    done()
  })

  test('FetchAction.js defaults to GET method', async(done) => {
    const action = new Action({url: 'some-link'})
    Assert.equal(action.params.method, 'GET')
    done()
  })

  test('FetchAction.js adds passed params as params on GET', async(done) => {
    const action = new Action({
      url: 'some-link',
      params: param
    })
    Assert.equal(action.params.method, 'GET')
    Assert.equal(action.params.params, param)
    done()
  })

  test('FetchAction.js adds passed params as data on other method', async(done) => {
    const action = new Action({
      url: 'some-link',
      params: param,
      method: 'post'
    })
    Assert.equal(action.params.method, 'POST')
    Assert.equal(action.params.data, param)
    done()
  })

  test('FetchAction.js::perform overrrides set params with passed params', async(done) => {
    const action = new Action({
      url: 'some-link',
      params: param
    })
    const passed =  {
      url: 'new-link',
      params: param
    }

    action.send = async (params) => {
      Assert.equal(params,passed)
      return 'mocked out'
    }
    await action.perform(passed)
    done()
  })

  test('FetchAction.js:: perform rejects promise when library throws', async(done) => {
    const passed = {
      url: 'some-link',
      params: param
    }
    const action = new Action(passed)

    action.send = async (params) => {
      Assert.equal(params, passed)
      throw new Error()
    }
    action.perform()
      .then(resp => {
        Assert.fail()
      })
      .catch(e => {
        Assert(e instanceof RequestError)
      })
    done()
  })

})