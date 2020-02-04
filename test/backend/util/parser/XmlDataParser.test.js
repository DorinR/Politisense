/* eslint-env jest */
const assert = require('chai').assert
const Parsers = require('@utils').Parsers
const XmlDataParser = Parsers.XmlDataParser
const DataNotFoundError = Parsers.DataNotFoundError

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

  it('should throw error if the tag was not found in the xml', () => {
    const xml = ''
    const parser = new XmlDataParser(xml)
    assert.throws(() => { parser.getDataInTag('nonExistingTag') }, DataNotFoundError)
    assert.throws(() => { parser.getDataInAttribute('nonExistingTag', 'a') }, DataNotFoundError)

    // extra param that prevents error
    assert.strictEqual(parser.getDataInTag('nonExistingTag', true), '')
    assert.strictEqual(parser.getDataInAttribute('nonExistingTag', 'a', true), '')
  })

  it('should return date in expected format when given a datetime to format', () => {
    const dateAsString = '2011-10-10T14:48:00'
    const formattedDate = new XmlDataParser('').formatXmlDate(dateAsString)
    assert.strictEqual(formattedDate, '2011-10-10')
  })
})
