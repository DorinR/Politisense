import { XmlDataParser } from './XmlDataParser'

class VoteXmlParser extends XmlDataParser {
  get tagName () {
    return 'VoteParticipant'
  }

  get listTagName () {
    return 'List'
  }

  generateNewParser (xml) {
    return new VoteXmlParser(xml)
  }

  xmlToJson () {
    const vote = {}

    // only get votes related to bills
    const billNumber = this.getDataInTag('BillNumberCode')
    const name = this.getDataInTag('DecisionDivisionSubject').trim()
    if (billNumber === '' || !this.isFinalDecision(name)) {
      return null
    } else {
      vote.billNumber = billNumber
      vote.name = name
    }

    vote.id = Number(this.getDataInTag('DecisionDivisionNumber'))
    vote.yeas = Number(this.getDataInTag('DecisionDivisionNumberOfYeas'))
    vote.nays = Number(this.getDataInTag('DecisionDivisionNumberOfNays'))
    vote.accepted = (vote.yeas > vote.nays)
    vote.voters = {}// TODO: param voters for the list of voters

    return vote
  }

  isFinalDecision (voteSubject) {
    return voteSubject.includes('3rd reading')
  }
}

module.exports.VoteXmlParser = VoteXmlParser
