import { XmlDataParser } from './XmlDataParser'

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

  xmlToJson () {
    const participant = {}

    try {
      const name = this.getDataInTag('FirstName') + ' ' + this.getDataInTag('LastName')
      participant.name = name.toLowerCase()
      participant.vote = this.getDataInTag('VoteValueName')
      participant.paired = this.getDataInTag('Paired') === '1'
    } catch (e) {
      console.debug(e.message)
      return null
    }

    return participant
  }

  getAllFromXml () {
    const participants = super.getAllFromXml()
    if (participants === []) {
      return {}
    }

    const votes = {}
    // eslint-disable-next-line no-unused-vars
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
