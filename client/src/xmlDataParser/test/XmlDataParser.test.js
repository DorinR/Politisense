import { XmlDataParser } from '../src/XmlDataParser'
import { assert } from 'chai'
// import { expect } from 'chai'
// import { should } from 'chai'

const fs = require('fs')
const path = require('path')


describe('XmlDataParser', () => {
  it('get text in xml', () => {
    const xml = '<text>ANSWER</text>'
    const parser = new XmlDataParser(xml)
    const parserAns = parser.getDataInTag('text')
    assert.strictEqual(parserAns, 'ANSWER')
  })

  it('get value of specified attribute', () => {
    const xml = '<text attribute="attr">ANSWER</text>'
    const parser = new XmlDataParser(xml)
    const parserAns = parser.getDataInAttribute('text', 'attribute')
    assert.strictEqual(parserAns, 'attr')
  })

  it('get xml from file', () => {
    const pathToXml = path.resolve(__dirname, './billc51.xml')
    const xml = fs.readFileSync(pathToXml) // added test bill to read
    const parser = new XmlDataParser(xml)

    const ans = parser.billXmlToJson()
    console.log(ans)
  })
})
