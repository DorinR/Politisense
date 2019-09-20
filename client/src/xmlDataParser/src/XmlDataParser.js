const cheerio = require('cheerio');

class XmlDataParser {
    constructor(xml) {
        this.xml = xml;
        this.$ = cheerio.load(xml, {
            normalizeWhitespace: true,
            xmlMode: true
        });
    }

    getDataInTag(tag) {
        return this.$(tag).text();
    }
}

module.exports.XmlDataParser = XmlDataParser;