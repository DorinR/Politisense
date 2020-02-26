const Action = require('./JobAction').AbstractJobAction
const DecorationError = require('../action/error/errors').ActionDecorationError
const XMLParser = require('../parser/XmlDataParser').XmlDataParser
const XMLParseError = require('../parser/XmlParserError').DataNotFoundError

class ParserWrapperAction extends Action {
  constructor (xmlParserType, params) {
    super()
    if (typeof xmlParserType !== typeof XMLParser) {
      throw new DecorationError(xmlParserType)
    }
    this.Create = xmlParserType.prototype.constructor
    this.params = params
  }

  async perform (xml) {
    const parser = new this.Create(xml)

    if (this.params) {
      Object.keys(this.params).forEach(key => {
        parser[key] = this.params[key]
      })
    }

    if (parser.hasData() && parser.hasListOfData()) {
      return [parser.getAllFromXml()]
    } else if (parser.hasData()) {
      return parser.xmlToJson()
    } else {
      throw new XMLParseError('ERROR: No Data Found')
    }
  }
}

module.exports.ParserWrapperAction = ParserWrapperAction
