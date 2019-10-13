/* eslint-env mocha */
import { assert } from 'chai'

import { BillXmlParser } from '../BillXmlParser'

const fs = require('fs')
const path = require('path')

describe('BillDataParser', () => {
  it('should return null if the bill was not passed', () => {
    const pathToXml = path.resolve(__dirname, 'testXml/testBill_Unpassed.xml')
    const xml = fs.readFileSync(pathToXml) // added test bill to read
    const parser = new BillXmlParser(xml)

    const res = parser.xmlToJson()
    assert.isNull(res)
  })

  it('should return specified bill info from xml', () => {
    const parser = getBillParserForXmlFile('testXml/testBill.xml')
    const bill = parser.xmlToJson()

    assert.isNotNull(bill)
    assert.strictEqual(bill.id, '9002286')
    assert.strictEqual(bill.number, 'C-51')
    assert.strictEqual(bill.title, 'An Act to amend the Criminal Code and the Department of Justice Act and to make consequential amendments to another Act')
    assert.strictEqual(bill.sponsorName, 'Jody Wilson-Raybould')
  })

  it('should get all bills in the list of bills in the xml', () => { // TODO more asserts
    const parser = getBillParserForXmlFile('testXml/testBill_List.xml')
    const bills = parser.getAllFromXml()

    assert.strictEqual(bills.length, 5)
  })
})

function getBillParserForXmlFile (xmlFilePath) {
  const pathToXml = path.resolve(__dirname, xmlFilePath)
  const xml = fs.readFileSync(pathToXml)
  return new BillXmlParser(xml)
}
