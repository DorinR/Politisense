const cheerio = require('cheerio')

class DataFromXmlNotFoundError extends Error {
  constructor (msg) {
    super()
    this.message = msg
    this.name = this.constructor.name
  }
}

class CurrentParliamentNotSpecifiedError extends Error {
  constructor (msg) {
    super()
    this.message = msg
    this.name = this.constructor.name
  }
}

class XmlDataParser {
  constructor (xml) {
    this.xml = xml
    this.$ = cheerio.load(xml, {
      normalizeWhitespace: true,
      xmlMode: true
    })
  }

  getDataInTag (tag, allowMissingTag = false) {
    if (!this.isTagInXml(tag)) {
      if (allowMissingTag) {
        return ''
      } else {
        throw new DataFromXmlNotFoundError(`The tag ${tag} does not exist in the xml file.`)
      }
    }
    return this.$(tag).eq(0).text()
  }

  getDataInAttribute (tag, attribute, allowMissingTag = false) {
    if (!this.isTagInXml(tag)) {
      if (allowMissingTag) {
        return ''
      } else {
        throw new DataFromXmlNotFoundError(`The tag ${tag} does not exist in the xml file.`)
      }
    }

    return this.$(tag).eq(0).attr(attribute)
  }

  // Takes a datetime string and returns a string that's only a date
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
  getAllFromXml (onlyFromListTag = false) {
    const listOfItems = []

    if (onlyFromListTag && !this.hasListOfData()) {
      return []
    }

    const foundData = onlyFromListTag ? this.$(this.listTagName).find(this.tagName) : this.$(this.tagName)

    foundData.each((i, data) => {
      const xml = this.$(data).toString()
      const parser = this.generateNewParser(xml)
      const item = parser.xmlToJson()
      if (item !== null) {
        listOfItems.push(item)
      }
    })
    return listOfItems
  }

  isTagInXml (tag) {
    return this.$(tag).length > 0
  }

  hasListOfData () {
    return this.isTagInXml(this.listTagName)
  }

  hasData () {
    return this.isTagInXml(this.TAG_NAME)
  }
}

module.exports.XmlDataParser = XmlDataParser
module.exports.DataFromXmlNotFoundError = DataFromXmlNotFoundError
module.exports.CurrentParliamentNotSpecifiedError = CurrentParliamentNotSpecifiedError
