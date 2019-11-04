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

  // returns the xml tag that holds the desired item
  get TAG_NAME () {
    throw new TypeError('Abstract Method: Implement and call in class')
  }

  // returns the xml tag that holds the list of the expected item
  get LIST_TAG_NAME () {
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

    if (this.$(this.LIST_TAG_NAME) <= 0) {
      return null
    }

    this.$(this.LIST_TAG_NAME).find(this.TAG_NAME).each((i, data) => {
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
