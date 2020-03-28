const Parsers = require('@parser')
const XmlDataParser = Parsers.XmlDataParser
const Builder = require('@builder')
const VoteRecordBuilder = Builder.VoteRecordBuilder

class VoteXmlParser extends XmlDataParser {
  constructor (xml, currentParliament) {
    super(xml)
    this.currentParliament = currentParliament
  }

  get tagName () {
    return 'Vote'
  }

  get listTagName () {
    return 'ArrayOfVote'
  }

  generateNewParser (xml) {
    return new VoteXmlParser(xml, this.currentParliament)
  }

  buildJson () {
    let type = ''
    const number = this.getDataInTag('BillNumberCode')
    if (this.isFinalDecision()) {
      type = 'assent'
    } else if (number !== '') {
      type = 'intermediate'
    } else if (number === '') {
      type = 'motion'
    } else {
      type = 'other'
    }
    const date = this.getDataInTag('DecisionEventDateTime')
    return new VoteRecordBuilder(Number(this.getDataInTag('DecisionDivisionNumber')))
      .withBillNumber(number)
      .withName(this.getDataInTag('DecisionDivisionSubject').trim())
      .withYeas(Number(this.getDataInTag('DecisionDivisionNumberOfYeas')))
      .withNays(Number(this.getDataInTag('DecisionDivisionNumberOfNays')))
      .withYear(Number(date.substring(0, 4)))
      .withMonth(Number(date.substring(5, 7)))
      .withType(type)
      .build()
  }

  passesFilters () {
    return true
  }

  isInCurrentParliament () {
    if (typeof this.currentParliament === 'undefined') {
      return true
    }

    const parliamentNumber = Number(this.getDataInTag('ParliamentNumber', true))
    const parliamentSession = Number(this.getDataInTag('SessionNumber', true))
    const parliamentMatches = this.currentParliament.number === parliamentNumber &&
      this.currentParliament.session === parliamentSession
    return parliamentMatches
  }

  isFinalDecision () {
    const voteSubject = this.getDataInTag('DecisionDivisionSubject', true).trim()
    return voteSubject.includes('3rd reading and adoption')
  }
}

module.exports.VoteXmlParser = VoteXmlParser
