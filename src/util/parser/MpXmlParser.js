<<<<<<< HEAD
require('module-alias/register')
=======
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
const Parsers = require('@parser')
const XmlDataParser = Parsers.XmlDataParser
const Models = require('@model')
const Politician = Models.Politician
<<<<<<< HEAD
=======
const Model = Models.Model

const cheerio = require('cheerio')
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend

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
<<<<<<< HEAD
    mp.withStartYear(Number(this.getDataInTag('FromDateTime').substring(0, 4)))
    mp.withEndYear(Number(this.getDataInTag('ToDateTime').substring(0, 4)))
    return mp.build()
=======
    mp.withYearElected(Number(this.getDataInTag('FromDateTime').substring(0, 4)))
    return Model.serialise(mp.build())
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
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
<<<<<<< HEAD
=======

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
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
}

module.exports.MpXmlParser = MpXmlParser
