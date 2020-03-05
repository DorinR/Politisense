/* eslint-env jest */
const Assert = require('chai').assert
const Parsers = require('../../../util/parser/parsers')
const XmlDataParser = Parsers.XmlDataParser
const DataNotFoundError = Parsers.DataNotFoundError

describe('XmlDataParser.js', () => {
  test('XmlDataParser.js::getDataInTag should get text in xml using getDataInTag()', () => {
    const xml = '<text>ANSWER</text>'
    const parser = new XmlDataParser(xml)
    const parserRes = parser.getDataInTag('text')
    Assert.strictEqual(parserRes, 'ANSWER')
  })

  test('XmlDataParser.js::getDataInAttribute should get value of specified attribute using getDataInAttribute', () => {
    const xml = '<text attribute="attr">ANSWER</text>'
    const parser = new XmlDataParser(xml)
    const parserRes = parser.getDataInAttribute('text', 'attribute')
    Assert.strictEqual(parserRes, 'attr')
  })

  test('should throw error if the tag was not found in the xml', () => {
    const xml = ''
    const parser = new XmlDataParser(xml)
    Assert.throws(() => { parser.getDataInTag('nonExistingTag') }, DataNotFoundError)
    Assert.throws(() => { parser.getDataInAttribute('nonExistingTag', 'a') }, DataNotFoundError)

    // extra param that prevents error
    Assert.strictEqual(parser.getDataInTag('nonExistingTag', true), '')
    Assert.strictEqual(parser.getDataInAttribute('nonExistingTag', 'a', true), '')
  })

  test('should return date in expected format when given a datetime to format', () => {
    const dateAsString = '2011-10-10T14:48:00'
    const formattedDate = new XmlDataParser('').formatXmlDate(dateAsString)
    Assert.strictEqual(formattedDate, '2011-10-10')
  })

  test('XmlDataParser.js unimplemented functions throw', () => {
    const parser = new XmlDataParser('')
    Assert.throws(() => {
      parser.tagName
    })
    Assert.throws(() => {
      parser.listTagName
    })
    Assert.throws(() => {
      parser.generateNewParser('')
    })
    Assert.throws(() => {
      parser.buildJson()
    })
  })

  test('XmlDataParser.js::getXmlInTag returns xml of given tag', () => {
    const xml = '<text><answer>ANSWER</answer></text>'
    const resp = '<answer>ANSWER</answer>'
    const parser = new XmlDataParser(xml)
    Assert.equal(parser.getXmlInTag('text'), resp)
  })

  test('XmlDataParser.js::getXmlInTag throws on missing if not specified', () => {
    const xml = '<text><answer>ANSWER</answer></text>'
    const parser = new XmlDataParser(xml)
    Assert.equal(parser.getXmlInTag('', true), '')
    Assert.throws(() => {
      parser.getXmlInTag('')
    })
  })
})
