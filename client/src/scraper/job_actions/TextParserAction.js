const ParsingLibrary = require('cheerio')
const JobAction = require('./JobAction').AbstractJobAction

class ParseError extends Error {
  constructor (msg) {
    super()
    this.message = msg
    this.name = 'ParseError'
  }
}

class TextParserAction extends JobAction {
  constructor (xml, tag, filter) {
    super()
    this.tag = (typeof tag === 'undefined') ? this.tag : tag
    this.filter = (typeof filter === 'undefined') ? this.filter : filter
    this.xml = xml
    if (this.xml) {
      this.load = this.loadAsXml.bind(this)
    } else {
      this.load = ParsingLibrary.load
    }
  }

  loadAsXml (content) {
    if (!content) {
      throw new ParseError('ERROR: need to pass non-null content to load function')
    }
    return this.load(content, {
      normalizeWhitespace: true,
      xmlMode: true,
      xml: true
    })
  }

  perform (content) {
    if (!content) {
      throw new ParseError('ERROR: need to pass content')
    }
    const $ = this.load(content, {
      normalizeWhitespace: true,
      xmlMode: this.xml,
      xml: this.xml
    })
    const tagList = []
    $(this.tag).each((i, elem) => {
      tagList[i] = this.filter(elem, $)
    })
    return tagList
  }
}
module.exports.TextParser = TextParserAction
module.exports.ParseError = ParseError
