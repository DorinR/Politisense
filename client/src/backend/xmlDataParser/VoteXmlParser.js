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
    if (!this.isInCurrentParliament()) {
      return null
    }

    const vote = {}

    try {
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
    } catch (e) {
      console.debug(e.message)
      return null
    }

    // async data, added separately
    vote.voters = {} // TODO: param voters for the list of voters

    return vote
  }

  isInCurrentParliament () {
    if (typeof this.currentParliament === 'undefined') {
      return true
    }

    const parliamentNumber = Number(this.getDataInTag('ParliamentNumber', true))
    const parliamentSession = Number(this.getDataInTag('SessionNumber', true))
    return this.currentParliament.number === parliamentNumber && this.currentParliament.session === parliamentSession
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

  isFinalDecision (voteSubject) {
    return voteSubject.includes('3rd reading and adoption')
  }
}

module.exports.VoteXmlParser = VoteXmlParser
