/* eslint-env mocha */
import { assert } from 'chai'

import { MpXmlParser } from '../MpXmlParser'

const fs = require('fs')
const path = require('path')

describe('MpDataParser', () => {
  it('should return mp info from xml', () => {
    const parser = getMpParserForXmlFile('testXml/testMp.xml')
    const mp = parser.xmlToJson()

    assert.strictEqual(mp.firstName, 'Jody')
    assert.strictEqual(mp.lastName, 'Wilson-Raybould')
    assert.strictEqual(mp.party, 'Independent')
    assert.strictEqual(mp.riding, 'Vancouver Granville')
  })

  it('should get all mps in the list of mps in the xml', () => { // TODO more asserts
    const parser = getMpParserForXmlFile('testXml/testMp_List.xml')
    const mps = parser.getAllFromXml()

    assert.strictEqual(mps.length, 14)
  })
})

function getMpParserForXmlFile (xmlFilePath) {
  const pathToXml = path.resolve(__dirname, xmlFilePath)
  const xml = fs.readFileSync(pathToXml)
  return new MpXmlParser(xml)
}
