/* eslint-env jest */
const Utils = require('../../../../util/utils')
const PDFFileRetrieverAction = Utils.Actions.PDFFileRetrieverAction
const chai = require('chai')
const Assert = chai.assert

describe('PDFFileRetrieverAction.js', () => {
  let mockSend
  beforeAll(() => {
    mockSend = async function (link) {
      if (link.includes('https://www.google.ca/')) {
        return {
          buffer: () => {
            return new ArrayBuffer(2)
          }
        }
      } else {
        throw new Error()
      }
    }
  })
  let underTest
  beforeEach(() => {
    underTest = new PDFFileRetrieverAction('https://www.google.ca/', 'some-bill')
  })

  test('PDFFileRetrieverAction::perform() throws on error', async (done) => {
    underTest.send = () => { throw new Error() }
    underTest.fp = ''
    const didThrow = await underTest.perform()
      .then((buffer) => {
        return false
      })
      .catch((e) => {
        return true
      })
    Assert.equal(didThrow, true)
    done()
  })

  test('PDFFileRetrieverAction::perform() returns buffer on success', async (done) => {
    underTest.send = mockSend
    const didReturn = await underTest.perform()
      .then((buffer) => {
        Assert.isTrue(buffer instanceof Uint8Array)
        return true
      })
      .catch(() => {
        return false
      })
    Assert.equal(didReturn, true)
    done()
  })

  test('PDFFileRetrieverAction::createBufferFromResponse() returns buffer from response', () => {
    const resp = {
      buffer: () => {
        return new ArrayBuffer()
      }
    }
    const buffer = underTest.createBufferFromResponse(resp)
    Assert.isOk(buffer)
    Assert.isTrue(buffer instanceof ArrayBuffer)
  })

  test('PDFFileRetrieverAction::formatBufferToUint8() returns formatted buffer object', () => {
    const buffer = new ArrayBuffer()
    const formatted = underTest.formatBufferToUint8(buffer)
    Assert.isOk(formatted)
    Assert.isTrue(formatted instanceof Uint8Array)
  })

  test('PDFFileRetrieverAction::perform rejects when library throws', async (done) => {
    underTest.send = async () => {
      throw new Error()
    }
    await underTest.perform()
      .then(resp => {
        Assert.fail()
      })
      .catch(e => {
        if(e instanceof chai.AssertionError) {
          Assert.fail()
        }
        Assert.isOk(e.bill)
        Assert.isOk(e.url)
      })
    done()
  })
})
