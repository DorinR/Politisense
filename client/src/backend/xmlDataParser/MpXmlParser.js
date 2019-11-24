import { XmlDataParser } from './XmlDataParser'

const cheerio = require('cheerio')

class MpXmlParser extends XmlDataParser {
  constructor (xml, mustBeACurrentMember = false) {
    super(xml)
    this.mustBeACurrentMember = mustBeACurrentMember
  }

  get tagName () {
    return 'MemberOfParliament'
  }

  get listTagName () {
    return 'ArrayOfMemberOfParliament'
  }

  generateNewParser (xml) {
    return new MpXmlParser(xml, this.mustBeACurrentMember)
  }

  buildJson () {
    const mp = {}
    const name = this.getDataInTag('PersonOfficialFirstName') + ' ' + this.getDataInTag('PersonOfficialLastName')
    mp.name = name.toLowerCase()
    mp.party = this.getDataInTag('CaucusShortName').toLowerCase()
    mp.riding = this.getDataInTag('ConstituencyName').toLowerCase()
    mp.yearElected = Number(this.getDataInTag('FromDateTime').substring(0, 4))
    mp.imageUrl = ''
    return mp
  }

  passesFilters () {
    return (!this.mustBeACurrentMember || this.isACurrentMember())
  }

  isACurrentMember () {
    const dateEnded = this.getDataInTag('ToDateTime', true)
    return dateEnded === ''
  }

  hasData () {
    return super.hasData() || this.isTagInXml(this.tagName + 'Role')
  }

  async getMpImageUrl (mpName) {
    const htmlWithMpImage = await this._getHtmlFromLink(this._getWebPageWithMpImage(mpName))
    if (htmlWithMpImage === '') {
      return ''
    }

    const $ = cheerio.load(htmlWithMpImage)
    return 'https://www.ourcommons.ca' + $('img.ce-mip-mp-picture').attr('src')
  }

  _getWebPageWithMpImage (mpName) {
    return `https://www.ourcommons.ca/Members/en/search?searchText=${mpName}&parliament=all`
  }
}

module.exports.MpXmlParser = MpXmlParser
