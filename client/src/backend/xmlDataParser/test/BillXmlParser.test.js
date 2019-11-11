/* eslint-env jest */
import { assert } from 'chai'

import { BillXmlParser } from '../BillXmlParser'
import { ParliamentNotSetError } from '../XmlParserError'

const fs = require('fs')
const path = require('path')

describe('BillXmlParser', () => {
  it('should return null if the bill does not have Royal Assent', () => {
    const xml = getXmlFromFilePath('testXml/testBill_Unpassed.xml')

    let parser = new BillXmlParser(xml, { mustHaveRoyalAssent: true })
    assert.isNull(parser.xmlToJson())

    parser = new BillXmlParser(xml)
    assert.isNotNull(parser.xmlToJson())
  })

  it('should return specified bill info from xml', () => {
    const xml = getXmlFromFilePath('testXml/testBill.xml')
    const parser = new BillXmlParser(xml)
    const bill = parser.xmlToJson()

    assert.isNotNull(bill)
    assert.strictEqual(bill.id, 9002286)
    assert.strictEqual(bill.number, 'C-51')
    assert.strictEqual(bill.title, 'An Act to amend the Criminal Code and the Department of Justice Act and to make consequential amendments to another Act')
    assert.strictEqual(bill.sponsorName, 'jody wilson-raybould')
    assert.strictEqual(bill.link, 'https://www.parl.ca/DocumentViewer/en/10276765?Language=E')
    assert.strictEqual(bill.dateVoted, '2017-06-06')
    assert.hasAnyKeys(bill, ['text'])
  })

  it('should get all Royal Assent bills, ', () => {
    const xml = getXmlFromFilePath('testXml/testBill_List.xml')
    const parser = new BillXmlParser(xml, { mustHaveRoyalAssent: true })
    const bills = parser.getAllFromXml()

    assert.strictEqual(bills.length, 5)
  })

  it('should return empty list if non bill xml', () => {
    const parser = new BillXmlParser('')
    const bills = parser.getAllFromXml()

    assert.isEmpty(bills)
  })

  it('should return null if bill is not of parliament', () => {
    const xml = getXmlFromFilePath('testXml/testBill.xml')

    const parliamentThatDoesntMatchBill = {
      number: 41,
      session: 2
    }

    let parser = new BillXmlParser(xml, { mustBeInCurrentParliament: true }, parliamentThatDoesntMatchBill)
    const bill = parser.xmlToJson()
    assert.isNull(bill)

    parser = new BillXmlParser(xml, { mustBeInCurrentParliament: true })
    assert.throws(() => { parser.xmlToJson() }, ParliamentNotSetError)
  })
})

function getXmlFromFilePath (xmlFilePath) {
  const pathToXml = path.resolve(__dirname, xmlFilePath)
  return fs.readFileSync(pathToXml)
}
