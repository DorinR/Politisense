const ParsingLibrary = require('cheerio')

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

class Parser {
  constructor () {
    this.tag = ''
    this.filter = function () {}
    this.load = ParsingLibrary.load
  }

  parse (html, tag, filter) {
    this.tag = (typeof tag === 'undefined') ? this.tag : tag
    this.filter = (typeof filter === 'undefined') ? this.filter : filter
    const $ = this.load(html)
    const tagList = []
    $(this.tag).each((i, elem) => {
      tagList[i - 1] = this.filter(elem)
    })
    return tagList
  }
}
module.exports.Parser = Parser
module.exports.ParseError = ParseError
