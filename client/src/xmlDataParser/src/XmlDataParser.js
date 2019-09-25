const cheerio = require('cheerio')

class XmlDataParser {
  constructor (xml) {
    this.xml = xml
    this.$ = cheerio.load(xml, {
      normalizeWhitespace: true,
      xmlMode: true
    })
  }

  getDataInTag (tag) {
    return this.$(tag).text()
  }

  getDataInAttribute (tag, attribute) {
    return this.$(tag)[0].attribs[attribute]
  }

  billXmlToJson () {
    let bill = {}
    bill.id = this.getDataInAttribute('BillNumber', 'number')
    bill.title = this.$('BillTitle').text()
    return this.$('BillTitle').children().attr('language', 'en')
    // return bill
  }
}

module.exports.XmlDataParser = XmlDataParser
