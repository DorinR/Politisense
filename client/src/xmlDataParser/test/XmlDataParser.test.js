/* eslint-env mocha */
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
})
