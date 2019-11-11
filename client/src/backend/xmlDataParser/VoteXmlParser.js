import { CurrentParliamentNotSpecifiedError, XmlDataParser } from './XmlDataParser'
import { VoteParticipantsXmlParser } from './VoteParticipantsXmlParser'
import { LinkScraper } from '../../scraper/job_actions/LinkScraperAction'

class VoteXmlParser extends XmlDataParser {
  static getVoteParticipantsUrl (voteId, currentParliament) {
    return `https://www.ourcommons.ca/Parliamentarians/en/HouseVotes/ExportDetailsVotes?
    output=XML&parliament=${currentParliament.number}&session=${currentParliament.session}&vote=${voteId}`
  }

  constructor (xml, currentParliament = undefined) {
    super(xml)
    this.currentParliament = currentParliament
  }

  get tagName () {
    return 'VoteParticipant'
  }

  get listTagName () {
    return 'List'
  }

  generateNewParser (xml) {
    return new VoteXmlParser(xml, this.currentParliament)
  }

  xmlToJson () {
    if (!this.passesFilters()) {
      return null
    }

    const vote = {}

    try {
      vote.billNumber = this.getDataInTag('BillNumberCode')
      vote.name = this.getDataInTag('DecisionDivisionSubject').trim()
      vote.id = Number(this.getDataInTag('DecisionDivisionNumber'))
      vote.yeas = Number(this.getDataInTag('DecisionDivisionNumberOfYeas'))
      vote.nays = Number(this.getDataInTag('DecisionDivisionNumberOfNays'))
    } catch (e) {
      console.debug(e.message)
      return null
    }

    // async data, added separately
    vote.voters = {} // TODO: param voters for the list of voters

    return vote
  }

  passesFilters () {
    return this.isInCurrentParliament() && this.isVoteForBill() && this.isFinalDecision()
  }

  isVoteForBill () {
    return this.getDataInTag('BillNumberCode') !== ''
  }

  isInCurrentParliament () {
    if (typeof this.currentParliament === 'undefined') {
      return true
    }

    const parliamentNumber = Number(this.getDataInTag('ParliamentNumber', true))
    const parliamentSession = Number(this.getDataInTag('SessionNumber', true))
    return this.currentParliament.number === parliamentNumber && this.currentParliament.session === parliamentSession
  }

  isFinalDecision () {
    const voteSubject = this.getDataInTag('DecisionDivisionSubject').trim()
    return voteSubject.includes('3rd reading and adoption')
  }

  async getVoters (voteId) {
    if (typeof this.currentParliament === 'undefined') {
      throw new CurrentParliamentNotSpecifiedError('Must specify what the current parliament is if it is used as a filter.')
    }

    const linkScraper = new LinkScraper(VoteXmlParser.getVoteParticipantsUrl(voteId, this.currentParliament))

    let voteParticipants = ''
    try {
      const res = await linkScraper.perform()
      voteParticipants = await res.body
    } catch (e) {
      console.error(e.message)
      return ''
    }

    return new VoteParticipantsXmlParser(voteParticipants).getAllFromXml()
  }
}

module.exports.VoteXmlParser = VoteXmlParser
