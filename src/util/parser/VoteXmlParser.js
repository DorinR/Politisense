const Parsers = require('@parser')
const XmlDataParser = Parsers.XmlDataParser
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
    const vote = VoteRecord.builder(Number(this.getDataInTag('DecisionDivisionNumber')))
    vote.withBillNumber(this.getDataInTag('BillNumberCode'))
    vote.withName(this.getDataInTag('DecisionDivisionSubject').trim())
    vote.withYeas(Number(this.getDataInTag('DecisionDivisionNumberOfYeas')))
    vote.withNays(Number(this.getDataInTag('DecisionDivisionNumberOfNays')))
    return Model.serialise(vote.build())
  }

  passesFilters () {
    return this.isInCurrentParliament() && this.isVoteForBill() && this.isFinalDecision()
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
}

module.exports.VoteXmlParser = VoteXmlParser
