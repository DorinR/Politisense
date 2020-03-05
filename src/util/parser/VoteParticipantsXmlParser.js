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
    const yea = this.getDataInTag('IsVoteYea') === 'true'
    const paired = this.getDataInTag('IsVotePaired') === 'true'

    return new Builders.VoteParticipantBuilder(this.id)
      .withMember(name.toLowerCase())
      .withYea(Boolean(yea))
      .withPaired(Boolean(paired))
      .build()
  }
}

module.exports.VoteParticipantsXmlParser = VoteParticipantsXmlParser
