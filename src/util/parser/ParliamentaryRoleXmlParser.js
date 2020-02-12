const XMLParser = require('@parser').XmlDataParser
const Builder = require('@builder').RoleBuilder

class ParliamentaryRoleXMLParser extends XMLParser {
  constructor (xml, id) {
    super(xml)
    this.id = id
  }

  static tagName () {
    return 'ParliamentaryPositionRole'
  }

  static listTagName () {
    return 'ParliamentaryPositionRoles'
  }

  get tagName () {
    return ParliamentaryRoleXMLParser.tagName()
  }

  get listTagName () {
    return ParliamentaryRoleXMLParser.listTagName()
  }

  generateNewParser (xml) {
    return new ParliamentaryRoleXMLParser(xml)
  }

  buildJson () {
    return new Builder(this.id)
      .withTitle(this.getDataInTag('Title').toLowerCase())
      .withFromYear(Number(this.getDataInTag('FromDateTime').substring(0, 4)))
      .withToYear(Number(this.getDataInTag('ToDateTime').substring(0, 4)))
      .withGroup('none')
      .withType('parliamentary')
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
  ParliamentaryRoleXMLParser: ParliamentaryRoleXMLParser
}
