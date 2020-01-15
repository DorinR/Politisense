/* eslint-env jest */
import { FileReader } from '../../../scraper/job_actions/XmlFileRetrieverAction'

const chai = require('chai')
const Assert = chai.assert

describe('PDFParseAction.js', () => {
  let mockSend
  beforeAll(() => {
    mockSend = async (filepath) => {
      if (filepath.includes('html')) {
        return {
          text: function () {
            return '<!DOCTYPE html>' +
              '<html>' +
              '<head>' +
              '</head>' +
              '<body>' +
              '<a href="https://www.google.ca/xml">google</a>' +
              '<a href="https://www.google.ca/xml">google1</a>' +
              '</body>' +
              '</html>'
          }
        }
      } else if (filepath.includes('xml')) {
        return {
          text: function () {
            // eslint-disable-next-line no-unused-expressions
            return '<some><xml><tag><structure></structure></tag></xml></some>'
          }
        }
      } else {
        throw new Error('this is bad thing to have happen')
      }
    }
  })
  it('PDFParseAction::perform() returns xml on good link', async (done) => {
    const underTest = new FileReader('https://www.i.want/this/xml/file/from/the/web/')
    underTest.send = mockSend
    const didGetXml = await underTest.perform()
      .then(res => {
        Assert.equal(typeof res, typeof '', 'Should be a string')
        Assert.isFalse(res.includes('html'), 'Should not be an html document')
        Assert.isTrue(res.includes('xml'), 'Should be an xml document')
        return true
      })
      .catch(e => {
        return false
      })
    Assert.equal(didGetXml, true)
    done()
  })

  it('PDFParseAction::perform() returns null on html returned', async (done) => {
    const underTest = new FileReader('https://www.i.do/not/wantthis/html/file/from/the/web/')
    underTest.send = mockSend
    const isNull = await underTest.perform()
      .then(res => {
        Assert.equal(res, null, 'Should be null')
        return true
      })
      .catch(e => {
        return false
      })
    Assert.equal(isNull, true)
    done()
  })

  it('PDFParseAction::perform() returns null on error', async (done) => {
    const underTest = new FileReader('https://www.i.want/this/to/throw')
    underTest.send = mockSend
    const isNull = await underTest.perform()
      .then(res => {
        Assert.equal(res, null, 'Should be null')
        return true
      })
      .catch(e => {
        return false
      })
    Assert.equal(isNull, true)
    done()
  })
})
