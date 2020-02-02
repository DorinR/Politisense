/* eslint-env jest */
import { PDFParseAction } from '../../../../backend/util/action/parse_action/PDFParseAction'

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
  const billId = 'some bill id'
  const url = 'https:://www.someurl.com'
  beforeEach(() => {
    underTest = new PDFParseAction(url, billId)
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

  it('PDFParseAction::perform() returns Object on success', async (done) => {
    const didGetContent = await underTest.perform(new Uint8Array())
      .then((res) => {
        Assert.equal(typeof res, typeof {})
        Assert.notEqual(res.content, null)
        Assert.notEqual(res.name, null)
        Assert.equal(typeof res.content, typeof '')
        Assert.equal(res.name, billId)
        return true
      })
      .catch((e) => {
        return false
      })
    Assert.equal(didGetContent, true)
    done()
  }, 1000)
})
