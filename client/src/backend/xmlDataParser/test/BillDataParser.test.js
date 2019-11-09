/* eslint-env jest */
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
    assert.strictEqual(bill.id, 9002286)
    assert.strictEqual(bill.number, 'C-51')
    assert.strictEqual(bill.title, 'An Act to amend the Criminal Code and the Department of Justice Act and to make consequential amendments to another Act')
    assert.strictEqual(bill.sponsorName, 'jody wilson-raybould')
    assert.strictEqual(bill.textUrl, 'https://www.parl.ca/DocumentViewer/en/10276765?Language=E')
    assert.strictEqual(bill.dateVoted, '2017-06-06')
    assert.hasAnyKeys(bill, ['text'])
  })

  it('should get all bills in the list of bills in the xml', () => {
    const parser = getBillParserForXmlFile('testXml/testBill_List.xml')
    const bills = parser.getAllFromXml()

    assert.strictEqual(bills.length, 5)
  })

  it('should return empty list if the xml file is not for bills', () => {
    const parser = new BillXmlParser('')
    const bills = parser.getAllFromXml()

    assert.isEmpty(bills)
  })

  it('should return null if the bill is not of the specified parliament', () => {
    const parliamentThatDoesntMatchBill = {
      number: 41,
      session: 2
    }
    let parser = getBillParserForXmlFile('testXml/testBill.xml', parliamentThatDoesntMatchBill)
    const bill = parser.xmlToJson()
    assert.isNull(bill)

    parser = getBillParserForXmlFile('testXml/testBill.xml')
    const billWithUndefinedParliament = parser.xmlToJson()
    assert.isNotNull(billWithUndefinedParliament)
  })
})

function getBillParserForXmlFile (xmlFilePath, currentParliament = undefined) {
  const pathToXml = path.resolve(__dirname, xmlFilePath)
  const xml = fs.readFileSync(pathToXml)
  return new BillXmlParser(xml, currentParliament)
}
