import { XmlDataParser } from './XmlDataParser'
import { Politician } from '../../models/Politician'
import { Model } from '../../models/Model'

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
    const name = this.getDataInTag('PersonOfficialFirstName') + ' ' + this.getDataInTag('PersonOfficialLastName')
    const mp = Politician.builder(name.toLowerCase())
    mp.withParty(this.getDataInTag('CaucusShortName').toLowerCase())
    mp.withRiding(this.getDataInTag('ConstituencyName').toLowerCase())
    mp.withYearElected(Number(this.getDataInTag('FromDateTime').substring(0, 4)))
    return Model.serialise(mp.build())
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
