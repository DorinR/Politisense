const Parsers = require('@parser')
const XmlDataParser = Parsers.XmlDataParser
<<<<<<< HEAD
const Builder = require('@builder')
const VoteRecordBuilder = Builder.VoteRecordBuilder

class VoteXmlParser extends XmlDataParser {
=======
const ParliamentNotSetError = Parsers.ParliamentNotSetError
const VoteParticipantsXmlParser = require('./VoteParticipantsXmlParser').VoteParticipantsXmlParser

const Models = require('@model')
const Model = Models.Model
const VoteRecord = Models.VoteRecord

class VoteXmlParser extends XmlDataParser {
  static getVoteParticipantsUrl (voteId, currentParliament) {
    return 'https://www.ourcommons.ca/Parliamentarians/en/HouseVotes/ExportDetailsVotes?' +
    `output=XML&parliament=${currentParliament.number}&session=${currentParliament.session}&vote=${voteId}`
  }

>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  constructor (xml, currentParliament) {
    super(xml)
    this.currentParliament = currentParliament
  }

  get tagName () {
<<<<<<< HEAD
    return 'Vote'
  }

  get listTagName () {
    return 'ArrayOfVote'
=======
    return 'VoteParticipant'
  }

  get listTagName () {
    return 'List'
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  }

  generateNewParser (xml) {
    return new VoteXmlParser(xml, this.currentParliament)
  }

  buildJson () {
<<<<<<< HEAD
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
    return true // this.isInCurrentParliament() && this.isVoteForBill() && this.isFinalDecision()
=======
    const vote = VoteRecord.builder(Number(this.getDataInTag('DecisionDivisionNumber')))
    vote.withBillNumber(this.getDataInTag('BillNumberCode'))
    vote.withName(this.getDataInTag('DecisionDivisionSubject').trim())
    vote.withYeas(Number(this.getDataInTag('DecisionDivisionNumberOfYeas')))
    vote.withNays(Number(this.getDataInTag('DecisionDivisionNumberOfNays')))
    return Model.serialise(vote.build())
  }

  passesFilters () {
    return this.isInCurrentParliament() && this.isVoteForBill() && this.isFinalDecision()
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  }

  isVoteForBill () {
    return this.getDataInTag('BillNumberCode', true) !== ''
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
<<<<<<< HEAD
=======

  async getVoters (voteId) {
    if (typeof this.currentParliament === 'undefined') {
      throw new ParliamentNotSetError('Must specify what the current parliament is if it is used as a filter.')
    }

    const voteParticipants = await this._getHtmlFromLink(VoteXmlParser.getVoteParticipantsUrl(voteId, this.currentParliament))
    if (voteParticipants === '') {
      return ''
    }

    return new VoteParticipantsXmlParser(voteParticipants).getAllFromXml()
  }
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
}

module.exports.VoteXmlParser = VoteXmlParser
