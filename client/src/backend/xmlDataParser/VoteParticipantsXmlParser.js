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

    participant.name = this.getDataInTag('FirstName') + ' ' + this.getDataInTag('LastName')

    // values can be 'Yea', 'Nay', or ''
    const voteValue = this.getDataInTag('VoteValueName')
    participant.vote = (voteValue === 'Paired') ? '' : voteValue

    participant.paired = this.getDataInTag('Paired') === '1'

    return participant
  }

  getAllFromXml () {
    const participants = super.getAllFromXml()

    // rather than array, use a key value JSON where the key is the Mp's name
    const votes = {}
    for (const participant of participants) {
      const name = participant.name
      votes[name] = {
        vote: participant.vote,
        paired: participant.paired
      }
    }

    return votes
  }
}

module.exports.VoteParticipantsXmlParser = VoteParticipantsXmlParser
