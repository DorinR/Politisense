/* eslint-env jest */
const Utils = require('../../../../util/utils')
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
    undertest = new HandleDownloadErrorAction(() => {}, () => {}, {
      url: 'www.google.ca'
    })
  })

  test('HandleDownloadErrorAction.js::perform() requeues connection errors', (done) => {
    connectionErrors.map(error => {
      let called = false
      undertest.callback = () => { called = true }
      undertest.perform(new ScrapeError(error, 'www.google.ca'))
      Assert(undertest.error instanceof ScrapeError)
      Assert(undertest.error.message.includes(error))
      Assert(called)
    })
    done()
  })

  test('HandleDownloadErrorAction.js::perform() requeues on read errors', (done) => {
    parseErrors.map(async error => {
      let called = false
      undertest.callback = () => { called = true }
      undertest.perform(new PDFParseError(error, 'www.google.ca'))
      Assert(undertest.error instanceof PDFParseError)
      Assert(undertest.error.message.includes(error))
      Assert(called)
    })
    done()
  })
})
