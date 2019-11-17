/* eslint-env jest */
import { assert } from 'chai'

import { MpXmlParser } from '../MpXmlParser'

const fs = require('fs')
const path = require('path')

describe('MpXmlParser', () => {
  it('should return mp info from xml', () => {
    const parser = getMpParserForXmlFile('testXml/testMp.xml', true)

    assert.isTrue(parser.hasData())
    assert.isFalse(parser.hasListOfData())

    const mp = parser.xmlToJson()

    assert.strictEqual(mp.name, 'jody wilson-raybould')
    assert.strictEqual(mp.politicalParty, 'independent')
    assert.strictEqual(mp.riding, 'vancouver granville')
    assert.strictEqual(mp.yearElected, 2015)
    assert.hasAnyKeys(mp, ['imageUrl'])
  })

  it('should get all mps in the list of mps in the xml', () => {
    const parser = getMpParserForXmlFile('testXml/testMp_List.xml')

    assert.isTrue(parser.hasData())
    assert.isTrue(parser.hasListOfData())

    const mps = parser.getAllFromXml()

    assert.strictEqual(mps.length, 8)
  })

  it('should get the image url of the mp', (done) => {
    const parser = getMpParserForXmlFile('testXml/testMp.xml')
    jest.spyOn(parser, '_getHtmlFromLink').mockImplementation(async () => {
      return '<img alt="" class="ce-mip-mp-picture visible-lg visible-md img-fluid" src="/Content/Parliamentarians/Images/OfficialMPPhotos/42/TrudeauJustin_LIB.jpg">'
    })

    const mpName = 'justin trudeau'

    parser.getMpImageUrl(mpName).then(url => {
      expect(parser._getHtmlFromLink).toHaveBeenCalledTimes(1)
      expect(parser._getHtmlFromLink).toHaveBeenCalledWith(parser._getWebPageWithMpImage(mpName))
      expect(url).not.toBeNull()
      expect(url).toBe('https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/42/TrudeauJustin_LIB.jpg')
      done()
    })
  })

  it('should return empty if mp image not found', (done) => {
    const parser = getMpParserForXmlFile('testXml/testMp.xml')
    jest.spyOn(parser, '_getHtmlFromLink').mockImplementation(async () => {
      return ''
    })

    const mpName = 'justin trudeau'

    parser.getMpImageUrl(mpName).then(url => {
      expect(parser._getHtmlFromLink).toHaveBeenCalledWith(parser._getWebPageWithMpImage(mpName))
      expect(url).toBe('')
      done()
    })
  })

  it('should return true if is a current mp', () => {
    const parser = getMpParserForXmlFile('testXml/testMp.xml')
    assert.isTrue(parser.isACurrentMember())
  })
})

function getMpParserForXmlFile (xmlFilePath, mustBeACurrentMember = false) {
  const pathToXml = path.resolve(__dirname, xmlFilePath)
  const xml = fs.readFileSync(pathToXml)
  return new MpXmlParser(xml, mustBeACurrentMember)
}
