const cheerio = require('cheerio')

class XmlDataParser {
  constructor (xml) {
    this.xml = xml
    this.$ = cheerio.load(xml, {
      normalizeWhitespace: true,
      xmlMode: true
    })
  }

  getDataInTag (tag) {
    return this.$(tag).text()
  }

  getDataInAttribute (tag, attribute) {
    return this.$(tag)[0].attribs[attribute]
  }

  billXmlToJson () {
    // only store passed bills
    const currentState = this.getDataInAttribute('Events', 'laagCurrentStage')
    if (currentState !== 'RoyalAssentGiven') {
      return null
    }

    const bill = {}
    bill.id = this.getDataInAttribute('BillNumber', 'number')
    bill.title = this.$('BillTitle').find("Title[language='en']").text().trim()
    bill.sponsorName = this.$('SponsorAffiliation').find('FullName').text()

    return bill
  }

  mpXmlToJson () {
    const mp = {}
    mp.firstName = this.getDataInTag('PersonOfficialFirstName')
    mp.lastName = this.getDataInTag('PersonOfficialLastName')
    mp.party = this.$('CaucusShortName').eq(0).text()
    mp.riding = this.getDataInTag('ConstituencyName')

    return mp
  }
}

module.exports.XmlDataParser = XmlDataParser
