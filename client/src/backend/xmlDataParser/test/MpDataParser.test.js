/* eslint-env jest */
import { assert } from 'chai'

import { MpXmlParser } from '../MpXmlParser'

const fs = require('fs')
const path = require('path')

describe('MpDataParser', () => {
  it('should return mp info from xml', () => {
    const parser = getMpParserForXmlFile('testXml/testMp.xml')
    const mp = parser.xmlToJson()

    assert.strictEqual(mp.name, 'jody wilson-raybould')
    assert.strictEqual(mp.party, 'independent')
    assert.strictEqual(mp.riding, 'vancouver granville')
    assert.strictEqual(mp.yearElected, 2015)
    assert.hasAnyKeys(mp, ['imageUrl'])
  })

  it('should get all mps in the list of mps in the xml', () => {
    const parser = getMpParserForXmlFile('testXml/testMp_List.xml')
    const mps = parser.getAllFromXml()

    assert.strictEqual(mps.length, 8)
  })
})

function getMpParserForXmlFile (xmlFilePath) {
  const pathToXml = path.resolve(__dirname, xmlFilePath)
  const xml = fs.readFileSync(pathToXml)
  return new MpXmlParser(xml)
}
