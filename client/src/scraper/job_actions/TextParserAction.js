const ParsingLibrary = require('cheerio')
const JobAction = require('./JobAction').AbstractJobAction

class ParseError extends Error {
  constructor (msg) {
    super()
    this.message = msg
    this.name = 'ParseError'
  }

  static doThrow (e) {
    throw new ParseError(e.message)
  }
}

class TextParserAction extends JobAction {
  constructor () {
    super()
    this.tag = ''
    this.filter = function () {}
    this.load = ParsingLibrary.load
  }

  loadAsXml (content) {
    return this.load(content, {
      normalizeWhitespace: true,
      xmlMode: true,
      xml: true
    })
  }

  perform (html, tag, filter) {
    this.tag = (typeof tag === 'undefined') ? this.tag : tag
    this.filter = (typeof filter === 'undefined') ? this.filter : filter
    const $ = this.load(html)
    const tagList = []
    $(this.tag).each((i, elem) => {
      tagList[i] = this.filter(elem)
    })
    return tagList
  }
}
module.exports.TextParser = TextParserAction
module.exports.ParseError = ParseError
