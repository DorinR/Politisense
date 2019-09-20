import {XmlDataParser} from '../src/XmlDataParser'

import {assert} from 'chai';
import {expect} from 'chai';
import {should} from 'chai';

describe('XmlDataParser', () => {
    it('get text in xml', () => {
        let xml = '<text>ANSWER</text>';
        let parser = new XmlDataParser(xml);
        let parserAns = parser.getDataInTag('text');
        assert.strictEqual(parserAns, 'ANSWER')
    });
});


