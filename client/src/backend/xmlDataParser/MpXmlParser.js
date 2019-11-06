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

    const firstName = this.getDataInTag('PersonOfficialFirstName')
    const lastName = this.getDataInTag('PersonOfficialLastName')
    const name = firstName + ' ' + lastName
    mp.name = name.toLowerCase()

    mp.party = this.$('CaucusShortName').eq(0).text().toLowerCase()
    mp.riding = this.getDataInTag('ConstituencyName').toLowerCase()
    mp.yearElected = this.formatXmlDate((this.getDataInTag('FromDateTime')))
    mp.imageUrl = '' // TODO: imageUrl, empty for now, need to find a way to get it

    return mp
  }
}

module.exports.MpXmlParser = MpXmlParser
