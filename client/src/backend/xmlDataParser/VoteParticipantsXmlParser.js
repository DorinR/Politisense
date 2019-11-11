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

    const name = this.getDataInTag('FirstName') + ' ' + this.getDataInTag('LastName')
    participant.name = name.toLowerCase()
    // values can be 'Yea', 'Nay', or 'Paired'
    participant.vote = this.getDataInTag('VoteValueName')
    participant.paired = this.getDataInTag('Paired') === '1'

    return participant
  }

  getAllFromXml () {
    const participants = super.getAllFromXml()

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
