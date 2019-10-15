import { XmlDataParser } from './XmlDataParser'

class VoteXmlParser extends XmlDataParser {
  get TAG_NAME () {
    return 'VoteParticipant'
  }

  get LIST_TAG_NAME () {
    return 'List'
  }

  generateNewParser (xml) {
    return new VoteXmlParser(xml)
  }

  xmlToJson () {
    const vote = {}

    // only get votes related to bills
    const billNumber = this.getDataInTag('BillNumberCode')
    if (billNumber === '') {
      return null
    } else {
      vote.billNumber = billNumber
    }

    vote.number = this.getDataInTag('DecisionDivisionNumber')
    vote.subject = this.getDataInTag('DecisionDivisionSubject')
    vote.yeas = Number(this.getDataInTag('DecisionDivisionNumberOfYeas'))
    vote.nays = Number(this.getDataInTag('DecisionDivisionNumberOfNays'))
    vote.accepted = (vote.yeas > vote.nays)

    // TODO get map of mp with vote type
    // TODO test

    return vote
  }
}

module.exports.VoteXmlParser = VoteXmlParser
