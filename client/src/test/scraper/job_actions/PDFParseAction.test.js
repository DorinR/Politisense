/* eslint-env jest */
import { PDFParseAction } from '../../../scraper/job_actions/PDFParseAction'

const chai = require('chai')
const Assert = chai.assert

describe('PDFParseAction.js', () => {
  let mockParse
  beforeAll(() => {
    mockParse = (buffer, cb) => {
      if (buffer && buffer instanceof Uint8Array) {
        cb(null, 'pdf has content')
        cb(null, null)
        return
      }
      cb(new Error(), null)
    }
  })
  let underTest
  beforeEach(() => {
    underTest = new PDFParseAction()
    underTest.parser.parseBuffer = mockParse
  })

  it('PDFParseAction::perform() Throws Error on bad Buffer', async (done) => {
    const didThrow = await underTest.perform(null)
      .then((res) => {
        return false
      })
      .catch(e => {
        return true
      })
    Assert.equal(didThrow, true)
    done()
  })

  it('PDFParseAction::perform() returns string on success', async (done) => {
    const didGetContent = await underTest.perform(new Uint8Array())
      .then((res) => {
        Assert.equal(typeof res, typeof '')
        return true
      })
      .catch((e) => {
        return false
      })
    Assert.equal(didGetContent, true)
    done()
  }, 1000)
})
