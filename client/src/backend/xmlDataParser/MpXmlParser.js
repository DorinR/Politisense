import { XmlDataParser } from './XmlDataParser'

class MpXmlParser extends XmlDataParser {
  get TAG_NAME () {
    return 'MemberOfParliament'
  }

  get LIST_TAG_NAME () {
    return 'ArrayOfMemberOfParliament'
  }

  generateNewParser (xml) {
    return new MpXmlParser(xml)
  }

  xmlToJson () {
    const mp = {}
    mp.firstName = this.getDataInTag('PersonOfficialFirstName')
    mp.lastName = this.getDataInTag('PersonOfficialLastName')
    mp.party = this.$('CaucusShortName').eq(0).text()
    mp.riding = this.getDataInTag('ConstituencyName')

    return mp
  }
}

module.exports.MpXmlParser = MpXmlParser
