/* eslint-env jest */
import { assert } from 'chai'

import { XmlDataParser } from '../XmlDataParser'

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

  it('should return date in expected format when given a datetime to format', () => {
    const dateAsString = '2011-10-10T14:48:00'
    const formattedDate = new XmlDataParser('').formatXmlDate(dateAsString)
    assert.strictEqual(formattedDate, '2011-10-10')
  })
})
