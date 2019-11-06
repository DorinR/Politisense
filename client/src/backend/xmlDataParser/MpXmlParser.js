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

    const name = this.getDataInTag('PersonOfficialFirstName') + ' ' + this.getDataInTag('PersonOfficialLastName')
    mp.name = name.toLowerCase()
    mp.party = this.$('CaucusShortName').eq(0).text().toLowerCase()
    mp.riding = this.getDataInTag('ConstituencyName').toLowerCase()
    mp.yearElected = Number(this.getDataInTag('FromDateTime').substring(0, 4))
    mp.imageUrl = '' // TODO: imageUrl, empty for now, need to find a way to get it

    return mp
  }
}

module.exports.MpXmlParser = MpXmlParser
