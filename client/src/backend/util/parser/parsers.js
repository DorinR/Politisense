module.exports.BillParser = require('./BillXmlParser').BillXmlParser
module.exports.PoliticianParser = require('./MpXmlParser').MpXmlParser
module.exports.VoteRecordParser = require('./VoteXmlParser').VoteXmlParser
module.exports.VoteParser = require('./VoteParticipantsXmlParser').VoteParticipantsXmlParser
module.exports.XMLParser = require('./XmlDataParser').XmlDataParser
module.exports.XMLParseError = require('./XmlParserError').DataNotFoundError
module.exports.ParliamentError = require('./XmlParserError').ParliamentNotSetError
