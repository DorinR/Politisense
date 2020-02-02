import { DataNotFoundError } from './XmlParserError'

const LinkScraperAction = require('../../util/utils').Actions.LinkScraperAction

const cheerio = require('cheerio')

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
        throw new DataNotFoundError(`The tag ${tag} does not exist in the xml file.`)
      }
    }
    return this.$(tag).eq(0).text()
  }

  getDataInAttribute (tag, attribute, allowMissingTag = false) {
    if (!this.isTagInXml(tag)) {
      if (allowMissingTag) {
        return ''
      } else {
        throw new DataNotFoundError(`The tag ${tag} does not exist in the xml file.`)
      }
    }

    return this.$(tag).eq(0).attr(attribute)
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

  generateNewParser (xml) {
    throw new TypeError('Abstract Method: Implement and call in class')
  }

  passesFilters () {
    return true
  }

  buildJson () {
    throw new TypeError('Abstract Method: Implement and call in class')
  }

  xmlToJson () {
    if (!this.passesFilters()) {
      return null
    }

    let json = {}
    try {
      json = this.buildJson()
    } catch (e) {
      console.debug(e.message)
      return null
    }

    return json
  }

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
    return this.isTagInXml(this.tagName)
  }

  _getHtmlFromLink (link) {
    return new LinkScraperAction(link).perform()
      .then(res => {
        return res.body
      }).then(html => {
        return html
      }).catch(e => {
        console.error(e.message)
        return ''
      })
  }
}

module.exports.XmlDataParser = XmlDataParser
