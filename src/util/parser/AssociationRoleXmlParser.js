const XMLParser = require('@parser').XmlDataParser
const Role = require('@model').Role
const Builder = require('@builder').RoleBuilder

class AssociationRoleXmlParser extends XMLParser {
  constructor (xml, id = 'placeholder') {
    super(xml)
    this.id = id
  }

  static tagName () {
    return 'ParliamentaryAssociationsandInterparliamentaryGroupRole'
  }

  static listTagName () {
    return 'ParliamentaryAssociationsandInterparliamentaryGroupRoles'
  }

  get tagName () {
    return AssociationRoleXmlParser.tagName()
  }

  get listTagName () {
    return AssociationRoleXmlParser.listTagName()
  }

  generateNewParser (xml) {
    return new AssociationRoleXmlParser(xml)
  }

  buildJson () {
    let title = `${this.getDataInTag('AssociationMemberRoleType').toLowerCase()} ` +
        `${this.getDataInTag('Title').toLowerCase()}`
    title.trim()
    return new Builder(this.id)
      .withTitle(title)
      //.withFromYear(Number(this.getDataInTag('FromDateTime').substring(0, 4)))
      //.withToYear(Number(this.getDataInTag('ToDateTime').substring(0, 4)))
      .withType('association')
      .withGroup(this.getDataInTag('Organization').toLowerCase())
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
  AssociationRoleXmlParser: AssociationRoleXmlParser
}