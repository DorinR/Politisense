require('module-alias/register')
const Parsers = require('@parser')
const XmlDataParser = Parsers.XmlDataParser
const CommitteeRoleParser = Parsers.CommitteeRoleXmlParser
const AssociationRoleParser = Parsers.AssociationRoleXmlParser
const ParliametaryRoleParser = Parsers.ParliamentaryRoleXMLParser
const Models = require('@model')
const Politician = Models.Politician
const cheerio = require('cheerio')

class MpXmlParser extends XmlDataParser {
  constructor (xml, withRoles = false, mustBeACurrentMember = false) {
    super(xml)
    this.mustBeACurrentMember = mustBeACurrentMember
    this.withRoles = withRoles
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
    if(this.withRoles) {
      return this.longMPJson()
    } else {
      return this.shortMPJson()
    }
  }

  shortMPJson () {
    const name = this.getDataInTag('PersonOfficialFirstName') + ' ' + this.getDataInTag('PersonOfficialLastName')
    const mp = Politician.builder(name.toLowerCase())
    mp.withParty(this.getDataInTag('CaucusShortName').toLowerCase())
    mp.withRiding(this.getDataInTag('ConstituencyName').toLowerCase())
    mp.withStartYear(Number(this.getDataInTag('FromDateTime').substring(0, 4)))
    mp.withEndYear(Number(this.getDataInTag('ToDateTime').substring(0, 4)))
    return mp.build()
  }

  longMPJson () {
    const mp = this.shortMPJson()
    const associations = new AssociationRoleParser(this.getXmlInTag(AssociationRoleParser.listTagName()))
    const committees = new CommitteeRoleParser(this.getXmlInTag(CommitteeRoleParser.listTagName()))
    const parliamentaries = new ParliametaryRoleParser(this.getXmlInTag(ParliametaryRoleParser.listTagName()))
    return {
      politician: mp,
      associations: associations.getAllFromXml(),
      committees: committees.getAllFromXml(),
      parliamentaries: parliamentaries.getAllFromXml()
    }
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
