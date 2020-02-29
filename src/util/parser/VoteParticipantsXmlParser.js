const Parsers = require('@parser')
const Builders = require('@builder')
const XmlDataParser = Parsers.XmlDataParser

class VoteParticipantsXmlParser extends XmlDataParser {
  constructor (xml, id) {
    super(xml)
    this.id = id
  }

  get tagName () {
    return 'VoteParticipant'
  }

  get listTagName () {
    return 'ArrayOfVoteParticipant'
  }

  generateNewParser (xml) {
    return new VoteParticipantsXmlParser(xml, this.id)
  }

  buildJson () {
    const name = this.getDataInTag('PersonOfficialFirstName') + ' ' + this.getDataInTag('PersonOfficialLastName')

    return new Builders.VoteParticipantBuilder(this.id)
      .withMember(name.toLowerCase())
      .withYea(Boolean(this.getDataInTag('IsVoteYea')))
      .withPaired(Boolean(this.getDataInTag('IsVotePaired')))
      .build()
  }
}

module.exports.VoteParticipantsXmlParser = VoteParticipantsXmlParser
