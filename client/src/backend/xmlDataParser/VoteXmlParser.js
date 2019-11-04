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
    const voteSubject = this.getDataInTag('DecisionDivisionSubject').trim()
    if (billNumber === '' || !this.isFinalDecision(voteSubject)) {
      return null
    } else {
      vote.billNumber = billNumber
      vote.subject = voteSubject
    }

    vote.number = Number(this.getDataInTag('DecisionDivisionNumber'))
    vote.yeas = Number(this.getDataInTag('DecisionDivisionNumberOfYeas'))
    vote.nays = Number(this.getDataInTag('DecisionDivisionNumberOfNays'))
    vote.accepted = (vote.yeas > vote.nays)

    return vote
  }

  isFinalDecision (voteSubject) {
    return voteSubject.includes('3rd reading')
  }
}

module.exports.VoteXmlParser = VoteXmlParser
