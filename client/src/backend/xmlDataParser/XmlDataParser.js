const cheerio = require('cheerio')

class XmlDataParser {
  constructor (xml) {
    this.xml = xml
    this.$ = cheerio.load(xml, {
      normalizeWhitespace: true,
      xmlMode: true
    })
  }

  /**
   * returns any text within an element and its child elements
   * @param {string} tag
   * @returns {string}
   */
  getDataInTag (tag) {
    return this.$(tag).text()
  }

  /**
   * get the value of an attribute within an element
   * @param {string} tag
   * @param {string} attribute
   * @returns {string}
   */
  getDataInAttribute (tag, attribute) {
    return this.$(tag).attr(attribute)
  }

  /**
   * Takes a datetime string and returns a string that's only a date
   * @param {string} xmlDate
   * @returns {string}
   */
  formatXmlDate (xmlDate) {
    return xmlDate.substring(0, xmlDate.indexOf('T'))
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
