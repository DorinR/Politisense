import { XmlDataParser } from './XmlDataParser'

class BillXmlParser extends XmlDataParser {
  get TAG_NAME () {
    return 'Bill'
  }

  get LIST_TAG_NAME () {
    return 'Bills'
  }

  generateNewParser (xml) {
    return new BillXmlParser(xml)
  }

  xmlToJson () {
    // only store passed bills
    const currentState = this.getDataInAttribute('Events', 'laagCurrentStage')
    if (currentState !== 'RoyalAssentGiven') {
      return null
    }

    const bill = {}
    bill.id = Number(this.getDataInAttribute(this.TAG_NAME, 'id'))
    bill.number = this.getDataInAttribute('BillNumber', 'prefix') + '-' +
      this.getDataInAttribute('BillNumber', 'number')
    bill.title = this.$('BillTitle').find('Title[language=\'en\']').text().trim()
    const sponsorName = this.$('SponsorAffiliation').find('FirstName').text() + ' ' + this.$('SponsorAffiliation').find('LastName').text()
    bill.sponsorName = sponsorName.toLowerCase()
    bill.textUrl = this.getTextUrl()
    bill.dateVoted = this.formatXmlDate(this.getDataInTag('BillIntroducedDate'))
    bill.text = '' // TODO: get the bill text when getting from online

    return bill
  }

  getTextUrl () {
    let textUrl = ''
    this.$('Publications').find('Publication').each((i, pub) => {
      const isRoyalAssent = this.$(pub).find('Title').text().includes('Royal Assent')
      if (isRoyalAssent) {
        textUrl = this.$(pub).find('PublicationFile[language=\'en\']').attr('relativePath').replace('//', 'https://www.')
      }
    })
    return textUrl
  }
}

module.exports.BillXmlParser = BillXmlParser
