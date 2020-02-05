const Parsers = require('@parser')
<<<<<<< HEAD
const Builders = require('@builder')
const XmlDataParser = Parsers.XmlDataParser

class VoteParticipantsXmlParser extends XmlDataParser {
  constructor (xml, id) {
    super(xml)
    this.id = id
  }

=======
const XmlDataParser = Parsers.XmlDataParser

class VoteParticipantsXmlParser extends XmlDataParser {
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  get tagName () {
    return 'VoteParticipant'
  }

  get listTagName () {
<<<<<<< HEAD
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
=======
    return 'List'
  }

  generateNewParser (xml) {
    return new VoteParticipantsXmlParser(xml)
  }

  buildJson () {
    const participant = {}
    const name = this.getDataInTag('FirstName') + ' ' + this.getDataInTag('LastName')
    participant.name = name.toLowerCase()
    participant.vote = this.getDataInTag('VoteValueName')
    participant.paired = this.getDataInTag('Paired') === '1'
    return participant
  }

  getAllFromXml () {
    const participants = super.getAllFromXml()
    if (participants === []) {
      return {}
    }

    const votes = {}
    participants.forEach(participant => {
      const name = participant.name
      votes[name] = {
        vote: participant.vote,
        paired: participant.paired
      }
    })

    return votes
  }

  getVoteId () {
    return Number(this.getDataInTag('DecisionDivisionNumber', true))
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  }
}

module.exports.VoteParticipantsXmlParser = VoteParticipantsXmlParser
