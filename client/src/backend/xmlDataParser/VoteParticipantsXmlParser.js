import { XmlDataParser } from './XmlDataParser'

class VoteParticipantsXmlParser extends XmlDataParser {
  get TAG_NAME () {
    return 'VoteParticipant'
  }

  get LIST_TAG_NAME () {
    return 'List'
  }

  generateNewParser (xml) {
    return new VoteParticipantsXmlParser(xml)
  }

  xmlToJson () {
    const participant = {}

    const name = this.getDataInTag('FirstName') + ' ' + this.getDataInTag('LastName')
    participant.name = name.toLowerCase()
    // values can be 'Yea', 'Nay', or 'Paired'
    participant.vote = this.getDataInTag('VoteValueName')
    participant.paired = this.getDataInTag('Paired') === '1'

    return participant
  }

  getAllFromXml () {
    const participants = super.getAllFromXml()
    if (participants === []) {
      return {}
    }

    // rather than array, use a key value JSON where the key is the Mp's name
    const votes = {}
    // eslint-disable-next-line no-unused-vars
    for (const participant of participants) {
      const name = participant.name
      votes[name] = {
        vote: participant.vote,
        paired: participant.paired
      }
    }

    return votes
  }

  getVoteId () {
    return Number(this.getDataInTag('DecisionDivisionNumber'))
  }
}

module.exports.VoteParticipantsXmlParser = VoteParticipantsXmlParser
