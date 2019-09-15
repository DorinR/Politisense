const ParsingLibrary = require('cheerio')

class ParseError extends Error {
  constructor (msg) {
    super()
    this.message = msg
    this.name = 'ParseError'
  }
}

class Parser {
  constructor (tag, cb) {
    this.tag = tag
    this.select = cb
  }

  parse (html) {
    const $ = ParsingLibrary.load(html)
    $(this.tag).each((i, elem) => {
      this.select(elem.attribs.href)
    })
  }
}
module.exports.Parser = Parser
module.exports.ParseError = ParseError
