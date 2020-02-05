/* eslint-env jest */
const Utils = require('../../../../util/utils')
const HandleConnectionErrorAction = Utils.Actions.HandleConnectionErrorAction
const ScrapeError = Utils.Actions.Errors.ScrapeError

const chai = require('chai')
const Assert = chai.assert

describe('HandleConnectionErrorAction.js', () => {
  const connectionErrors = [
    'ESOCKETTIMEDOUT',
    'ETIMEDOUT',
    'ECONNRESET',
    'EPIPE',
    'ENOTFOUND'
  ]

  let undertest
  const cb = () => {}
  const create = () => {}
  const tlds = ['https://www.google.ca/']
  beforeEach(() => {
    undertest = new HandleConnectionErrorAction(cb, create, tlds)
  })

  test('HandleConnectionErrorAction.js::connectionErrorName() returns name of connection error from message', async (done) => {
    connectionErrors.forEach(error => {
      Assert.equal(HandleConnectionErrorAction.connectionErrorName(error), error)
    })

    done()
  })

  test('HandleConnectionErrorAction.js::connectionErrorName() returns null if not connection error', async (done) => {
    Assert.equal(HandleConnectionErrorAction.connectionErrorName('some message about another error type'), null)
    done()
  })

  test('HandleConnectionErrorAction.js::perform() returns with error on unexpected', async (done) => {
    const msg = 'this is an expected thing to see in the log'
    const e = await undertest.perform(new Error(msg))
    Assert(e instanceof Error)
    Assert.equal(e.message, msg)
    done()
  })

  test('HandleConnectionErrorAction.js::perform() returns with error on malformed', async (done) => {
    const msg = 'this is an expected thing to see in the log'
    const url = 'https://dfjkggdgdgdjl///.'
    const e = await undertest.perform(new ScrapeError(msg, url))
    Assert(e instanceof ScrapeError)
    Assert(e.message.includes('Malformed'))
    done()
  })

  test('HandleConnectionErrorAction.js::perform() returns with error on partial links and requeues best guess', async (done) => {
    const msg = 'this is an expected thing to see in the log'
    const urls = ['/links', '//links']
    let called = false
    undertest.callback = () => {
      called = true
    }
    await Promise.all(
      urls.map(async link => {
        called = false
        const e = await undertest.perform(new ScrapeError(msg, link))
        Assert(e instanceof ScrapeError)
        Assert(e.message.includes('Re-enqueuing'))
        Assert(called)
      })
    )
    done()
  })

  test('HandleConnectionErrorAction.js::perform() returns with error on connection error and requeues ', async (done) => {
    const link = 'https://www.google.ca/'
    let called = false
    undertest.callback = () => {
      called = true
    }
    await Promise.all(
      connectionErrors.map(async error => {
        called = false
        const e = await undertest.perform(new ScrapeError(error, link))
        Assert(e instanceof ScrapeError)
        Assert(e.message.includes(error))
        Assert(called)
      })
    )
    done()
  })
})
