import { XmlDataParser } from './XmlDataParser'
import { LinkScraper } from '../../scraper/job_actions/LinkScraperAction'

const cheerio = require('cheerio')

class MpXmlParser extends XmlDataParser {
  get TAG_NAME () {
    return 'MemberOfParliament'
  }

  get LIST_TAG_NAME () {
    return 'ArrayOfMemberOfParliament'
  }

  generateNewParser (xml) {
    return new MpXmlParser(xml)
  }

  xmlToJson () {
    const mp = {}

    const name = this.getDataInTag('PersonOfficialFirstName') + ' ' + this.getDataInTag('PersonOfficialLastName')
    mp.name = name.toLowerCase()
    mp.party = this.$('CaucusShortName').eq(0).text().toLowerCase()
    mp.riding = this.getDataInTag('ConstituencyName').toLowerCase()
    mp.yearElected = Number(this.getDataInTag('FromDateTime').substring(0, 4))
    mp.imageUrl = '' // TODO: imageUrl, empty for now, need to put together

    return mp
  }

  hasData () {
    return super.hasData() || this.$(this.TAG_NAME + 'Role').length > 0
  }

  getWebPageWithMpImage (mpName) {
    return `https://www.ourcommons.ca/Members/en/search?searchText=${mpName}&parliament=all`
  }

  // TODO: Refactor to work with scraper
  async getMpImageUrl (mpName) {
    const linkScraper = new LinkScraper(this.getWebPageWithMpImage(mpName))

    let htmlWithMpImage = ''
    try {
      htmlWithMpImage = await linkScraper.perform()
      console.log(htmlWithMpImage)
    } catch (e) {
      console.log(e.message)
      return ''
    }

    const $ = cheerio.load(htmlWithMpImage)
    return 'https://www.ourcommons.ca' + $('img.ce-mip-mp-picture').attr('src')
  }
}

module.exports.MpXmlParser = MpXmlParser
