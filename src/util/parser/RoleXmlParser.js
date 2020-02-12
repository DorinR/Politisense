const Parsers = require('@parser')
const XmlDataParser = Parsers.XmlDataParser
const CommitteeRoleParser = Parsers.CommitteeRoleXmlParser
const AssociationRoleParser = Parsers.AssociationRoleXmlParser
const ParliametaryRoleParser = Parsers.ParliamentaryRoleXMLParser

class RoleXmlParser extends XmlDataParser {
  get tagName () {
    return 'Profile'
  }

  get listTagName () {
    return 'none'
  }

  generateNewParser (xml) {
    return new RoleXmlParser(xml, this.mustBeACurrentMember)
  }

  buildJson () {
    const associations = new AssociationRoleParser(this.getXmlInTag(AssociationRoleParser.listTagName()))
    const committees = new CommitteeRoleParser(this.getXmlInTag(CommitteeRoleParser.listTagName()))
    const parliamentaries = new ParliametaryRoleParser(this.getXmlInTag(ParliametaryRoleParser.listTagName()))
    return {
      associations: associations.getAllFromXml(),
      committees: committees.getAllFromXml(),
      parliamentaries: parliamentaries.getAllFromXml()
    }
  }

  passesFilters () {
    return true
  }

  hasData () {
    return super.hasData() || this.isTagInXml(this.tagName)
  }
}

module.exports = {
  RoleXmlParser: RoleXmlParser
}
