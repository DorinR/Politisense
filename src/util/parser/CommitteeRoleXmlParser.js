const XMLParser = require('@parser').XmlDataParser
const Role = require('@model').Role
const Builder = require('@builder').RoleBuilder

class CommitteeRoleXmlParser extends XMLParser {
  constructor (xml, id) {
    super(xml)
    this.id = id
  }

  static tagName () {
    return 'CommitteeMemberRole'
  }

  static listTagName () {
    return 'CommitteeMemberRoles'
  }

  get tagName () {
    return CommitteeRoleXmlParser.tagName()
  }

  get listTagName () {
    return CommitteeRoleXmlParser.listTagName()
  }

  generateNewParser (xml) {
    return new CommitteeRoleXmlParser(xml)
  }

  buildJson () {
    const title = `${this.getDataInTag('AffiliationRoleName').toLowerCase()}`
    return new Builder(this.id)
      .withTitle(title)
      .withFromYear(Number(this.getDataInTag('FromDateTime').substring(0, 4)))
      .withToYear(Number(this.getDataInTag('ToDateTime').substring(0, 4)))
      .withGroup(this.getDataInTag('CommitteeName').toLowerCase())
      .withType('committee')
      .build()
  }

  passesFilters () {
    return true
  }

  hasData () {
    return super.hasData() || this.isTagInXml(this.tagName)
  }
}

module.exports = {
  CommitteeRoleXmlParser: CommitteeRoleXmlParser
}