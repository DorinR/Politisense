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
    bill.sponsorName = this.$('SponsorAffiliation').find('FullName').text()
    bill.textUrl = ''
    this.$('Publications').find('Publication').each((i, pub) => {
      const isRoyalAssent = this.$(pub).find('Title').text().includes('Royal Assent')
      if (isRoyalAssent) {
        bill.text = this.$(pub).find('PublicationFile[language=\'en\']').attr('relativePath').replace('//', 'https://www.')
      }
    })

    return bill
  }
}

module.exports.BillXmlParser = BillXmlParser
