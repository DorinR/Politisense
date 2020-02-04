/* eslint-env jest */
const Utils = require('@utils')
const HandleDownloadErrorAction = Utils.Actions.HandleDownloadErrorAction
const ScrapeError = Utils.Actions.Errors.ScrapeError
const PDFParseError = Utils.Actions.Errors.PDFParseError

const chai = require('chai')
const Assert = chai.assert

describe('HandleDownloadErrorAction.js', () => {
  const connectionErrors = [
    'ESOCKETTIMEDOUT',
    'ETIMEDOUT',
    'ECONNRESET',
    'EPIPE',
    'ENOTFOUND'
  ]
  const parseErrors = [
    'InvalidPDF',
    'ParseException'
  ]
  let undertest
  beforeEach(() => {
    undertest = new HandleDownloadErrorAction(() => {}, () => {})
  })

  test('HandleDownloadErrorAction.js::perform() requeues connection errors', async (done) => {
    await Promise.all(
      connectionErrors.map(async error => {
        let called = false
        undertest.callback = () => { called = true }
        const e = await undertest.perform(new ScrapeError(error, 'www.google.ca'))
        Assert(e instanceof ScrapeError)
        Assert(e.message.includes('Connection failure'))
        Assert(called)
      })
    )
    done()
  })

  test('HandleDownloadErrorAction.js::perform() requeues on read errors', async (done) => {
    await Promise.all(
      parseErrors.map(async error => {
        let called = false
        undertest.callback = () => { called = true }
        const e = await undertest.perform(new ScrapeError(error, 'www.google.ca'))
        Assert(e instanceof PDFParseError)
        Assert(e.message.includes('was corrupted'))
        Assert(called)
      })
    )
    done()
  })
})
