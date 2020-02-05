const Parsers = require('@parser')
const XmlDataParser = Parsers.XmlDataParser

class VoteParticipantsXmlParser extends XmlDataParser {
  get tagName () {
    return 'VoteParticipant'
  }

  get listTagName () {
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
  }
}

module.exports.VoteParticipantsXmlParser = VoteParticipantsXmlParser
