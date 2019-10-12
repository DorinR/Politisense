/* eslint-env mocha */
import { XmlDataParser } from '../src/XmlDataParser'
import { BillXmlParser } from '../src/BillXmlParser'
import { MpXmlParser } from '../src/MpXmlParser'
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
    const parser = new BillXmlParser(xml)

    const res = parser.xmlToJson()
    assert.isNull(res)
  })

  it('should return specified bill info', () => {
    const parser = getBillParserForXmlFile('./testBill.xml')
    const bill = parser.xmlToJson()

    assert.isNotNull(bill)
    assert.strictEqual(bill.id, '9002286')
    assert.strictEqual(bill.number, 'C-51')
    assert.strictEqual(bill.title, 'An Act to amend the Criminal Code and the Department of Justice Act and to make consequential amendments to another Act')
    assert.strictEqual(bill.sponsorName, 'Jody Wilson-Raybould')
  })

  it('should return specified mp info', () => {
    const parser = getMpParserForXmlFile('./testMp.xml')
    const mp = parser.xmlToJson()

    assert.strictEqual(mp.firstName, 'Jody')
    assert.strictEqual(mp.lastName, 'Wilson-Raybould')
    assert.strictEqual(mp.party, 'Independent')
    assert.strictEqual(mp.riding, 'Vancouver Granville')
  })

  it('should get all bills in the list', () => { // TODO more asserts
    const parser = getBillParserForXmlFile('./testBillsList.xml')
    const bills = parser.getAllFromXml()

    assert.strictEqual(bills.length, 5)
  })

  // TODO: test mp list

})

function getBillParserForXmlFile (xmlFilePath) {
  const pathToXml = path.resolve(__dirname, xmlFilePath)
  const xml = fs.readFileSync(pathToXml)
  return new BillXmlParser(xml)
}

function getMpParserForXmlFile (xmlFilePath) {
  const pathToXml = path.resolve(__dirname, xmlFilePath)
  const xml = fs.readFileSync(pathToXml)
  return new MpXmlParser(xml)
}
