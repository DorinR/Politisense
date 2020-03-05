require('module-alias/register')
const Parsers = require('@parser')
const XmlDataParser = Parsers.XmlDataParser
const Models = require('@model')
const Politician = Models.Politician

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
    mp.withStartYear(Number(this.getDataInTag('FromDateTime').substring(0, 4)))
    mp.withEndYear(Number(this.getDataInTag('ToDateTime').substring(0, 4)))
    return mp.build()
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
}

module.exports.MpXmlParser = MpXmlParser
