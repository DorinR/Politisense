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
    return this.$(tag).attr(attribute)
  }

  formatXmlDate (xmlDate) {
    return xmlDate.substring(0, xmlDate.indexOf('T'))
  }

  get tagName () {
    throw new TypeError('Abstract Method: Implement and call in class')
  }

  get listTagName () {
    throw new TypeError('Abstract Method: Implement and call in class')
  }

  // returns a parser of the same type
  generateNewParser (xml) {
    throw new TypeError('Abstract Method: Implement and call in class')
  }

  // returns the item with its attributes as a JSON object
  xmlToJson () {
    throw new TypeError('Abstract Method: Implement and call in class')
  }

  // returns a list of JSONs that represent the item, null if the xml doesn't match
  getAllFromXml () {
    const listOfItems = []

    if (this.$(this.listTagName) <= 0) {
      return null
    }

    this.$(this.listTagName).find(this.tagName).each((i, data) => {
      const xml = this.$(data).toString()
      const parser = this.generateNewParser(xml)
      const item = parser.xmlToJson()
      if (item !== null) {
        listOfItems.push(item)
      }
    })
    return listOfItems
  }
}

module.exports.XmlDataParser = XmlDataParser
