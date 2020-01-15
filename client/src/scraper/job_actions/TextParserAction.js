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
  constructor () {
    super()
    this.tag = ''
    this.filter = function () {}
    this.load = ParsingLibrary.load
    this.initialised = false
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

  perform (content, tag, filter) {
    if (!content || !tag || !filter) {
      throw new ParseError('ERROR: need to pass content, a searchable tag and a filter function')
    }
    this.tag = (typeof tag === 'undefined') ? this.tag : tag
    this.filter = (typeof filter === 'undefined') ? this.filter : filter
    const $ = this.load(content)
    const tagList = []
    $(this.tag).each((i, elem) => {
      tagList[i] = this.filter(elem)
    })
    return tagList
  }
}
module.exports.TextParser = TextParserAction
module.exports.ParseError = ParseError
