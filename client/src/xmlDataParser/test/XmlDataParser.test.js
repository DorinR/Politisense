/* eslint-env mocha */
import { XmlDataParser } from '../src/XmlDataParser'
import { assert } from 'chai'
// import { expect } from 'chai'
// import { should } from 'chai'

const fs = require('fs')
const path = require('path')

describe('XmlDataParser', () => {
  it('should get text in xml using getDataInTag()', () => {
    const xml = '<text>ANSWER</text>'
    const parser = new XmlDataParser(xml)
    const parserRes = parser.getDataInTag('text')
    assert.strictEqual(parserRes, 'ANSWER')
  })

  it('should get value of specified attribute using getDataInAttribute', () => {
    const xml = '<text attribute="attr">ANSWER</text>'
    const parser = new XmlDataParser(xml)
    const parserRes = parser.getDataInAttribute('text', 'attribute')
    assert.strictEqual(parserRes, 'attr')
  })

  it('should return null if the bill was not passed', () => {
    const pathToXml = path.resolve(__dirname, './testUnpassedBill.xml')
    const xml = fs.readFileSync(pathToXml) // added test bill to read
    const parser = new XmlDataParser(xml)

    const res = parser.billXmlToJson()
    assert.isNull(res)
  })

  it('should return specified bill info', () => {
    const parser = getParserForXmlFile('./testBill.xml')
    const bill = parser.billXmlToJson()

    assert.isNotNull(bill)
    assert.strictEqual(bill.id, '51')
    assert.strictEqual(bill.title, 'An Act to amend the Criminal Code and the Department of Justice Act and to make consequential amendments to another Act')
    assert.strictEqual(bill.sponsorName, 'Jody Wilson-Raybould')
  })

  it('should return specified mp info', () => {
    const parser = getParserForXmlFile('./testMp.xml')
    const mp = parser.mpXmlToJson()

    assert.strictEqual(mp.firstName, 'Jody')
    assert.strictEqual(mp.lastName, 'Wilson-Raybould')
    assert.strictEqual(mp.party, 'Independent')
    assert.strictEqual(mp.riding, 'Vancouver Granville')
  })
})

function getParserForXmlFile (xmlFilePath) {
  const pathToXml = path.resolve(__dirname, xmlFilePath)
  const xml = fs.readFileSync(pathToXml)
  return new XmlDataParser(xml)
}
