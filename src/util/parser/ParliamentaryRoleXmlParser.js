const XMLParser = require('@parser').XmlDataParser
const Role = require('@model').Role

class ParliamentaryRoleXMLParser extends XMLParser {
  constructor (xml, id) {
    super(xml)
    this.id = id
  }

  get tagName () {
    return 'ParliamentaryPositionRole'
  }

  get listTagName () {
    return 'ParliamentaryPositionRoles'
  }

  generateNewParser (xml) {
    return new ParliamentaryRoleXMLParser(xml)
  }

  buildJson () {
    return Role.builder(this.id)
      .withTitle(this.getDataInTag('Title').toLowerCase())
      .withFromYear(Number(this.getDataInTag('FromDateTime').substring(0, 4)))
      .withToYear(Number(this.getDataInTag('ToDateTime').substring(0, 4)))
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