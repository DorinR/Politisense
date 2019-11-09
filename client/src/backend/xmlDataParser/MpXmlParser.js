import { XmlDataParser } from './XmlDataParser'
import { LinkScraper } from '../../scraper/job_actions/LinkScraperAction'

const cheerio = require('cheerio')

class MpXmlParser extends XmlDataParser {
  constructor (xml, mustBeACurrentMember = false) {
    super(xml)
    this.mustBeACurrentMember = mustBeACurrentMember
  }

  get TAG_NAME () {
    return 'MemberOfParliament'
  }

  get LIST_TAG_NAME () {
    return 'ArrayOfMemberOfParliament'
  }

  generateNewParser (xml) {
    return new MpXmlParser(xml, this.mustBeACurrentMember)
  }

  xmlToJson () {
    if (!this.passesFilters()) {
      return null
    }

    const mp = {}

    const name = this.getDataInTag('PersonOfficialFirstName') + ' ' + this.getDataInTag('PersonOfficialLastName')
    mp.name = name.toLowerCase()
    mp.party = this.getDataInTag('CaucusShortName').toLowerCase()
    mp.riding = this.getDataInTag('ConstituencyName').toLowerCase()
    mp.yearElected = Number(this.getDataInTag('FromDateTime').substring(0, 4))

    // async data, added separately
    mp.imageUrl = ''

    return mp
  }

  passesFilters () {
    return (!this.mustBeACurrentMember || this.isACurrentMember())
  }

  isACurrentMember () {
    const dateEnded = this.getDataInTag('ToDateTime')
    return dateEnded === ''
  }

  hasData () {
    return super.hasData() || this.$(this.TAG_NAME + 'Role').length > 0
  }

  getWebPageWithMpImage (mpName) {
    return `https://www.ourcommons.ca/Members/en/search?searchText=${mpName}&parliament=all`
  }

  async getMpImageUrl (mpName) {
    const linkScraper = new LinkScraper(this.getWebPageWithMpImage(mpName))

    let htmlWithMpImage = ''
    try {
      htmlWithMpImage = await linkScraper.perform()
    } catch (e) {
      console.log(e.message)
      return ''
    }

    const $ = cheerio.load(htmlWithMpImage)
    return 'https://www.ourcommons.ca' + $('img.ce-mip-mp-picture').attr('src')
  }
}

module.exports.MpXmlParser = MpXmlParser
