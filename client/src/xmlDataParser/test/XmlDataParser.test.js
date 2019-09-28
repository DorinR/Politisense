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

  it('get xml from file', () => { // TODO to complete
    const pathToXml = path.resolve(__dirname, './testBill.xml')
    const xml = fs.readFileSync(pathToXml) // added test bill to read
    const parser = new XmlDataParser(xml)

    const ans = parser.billXmlToJson()

    // TODO assert non-null result first
    console.log(ans)
  })
})
