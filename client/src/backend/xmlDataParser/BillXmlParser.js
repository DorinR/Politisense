import { XmlDataParser } from './XmlDataParser'
import { ParliamentNotSetError } from './XmlParserError'

class BillXmlParser extends XmlDataParser {
  constructor (xml, filters, currentParliament) {
    super(xml)
    this.filters = Object.assign({}, BillXmlParser.defaultFilters, filters)
    this.currentParliament = currentParliament
  }

  get tagName () {
    return 'Bill'
  }

  get listTagName () {
    return 'Bills'
  }

  generateNewParser (xml) {
    return new BillXmlParser(xml, this.filters, this.currentParliament)
  }

  buildJson () {
    const bill = {}
    bill.id = Number(this.getDataInAttribute(this.tagName, 'id'))
    bill.number = this.getDataInAttribute('BillNumber', 'prefix') + '-' +
      this.getDataInAttribute('BillNumber', 'number')
    bill.title = this.$('BillTitle').find('Title[language=\'en\']').text().trim()
    const sponsorName = this.$('SponsorAffiliation').find('FirstName').text() + ' ' + this.$('SponsorAffiliation').find('LastName').text()
    bill.sponsorName = sponsorName.toLowerCase()
    bill.link = this.getLinkToBillText()
    bill.dateVoted = this.formatXmlDate(this.getDataInTag('BillIntroducedDate'))
    bill.text = ''
    return bill
  }

  getLinkToBillText () {
    let link = ''
    const publications = this.$('Publications').find('Publication')
    publications.each((i, pub) => {
      const isRoyalAssentText = this.$(pub).find('Title').text().includes('Royal Assent')
      if (isRoyalAssentText) {
        link = this.getPublicationUrlPath(pub).replace('//', 'https://www.')
      }
    })
    return link
  }

  getPublicationUrlPath (publication) {
    return this.$(publication).find('PublicationFile[language=\'en\']').attr('relativePath')
  }

  passesFilters () {
    return (!this.filters.mustHaveRoyalAssent || this.hasRoyalAssent()) &&
      (!this.filters.mustBeInCurrentParliament || this.isInCurrentParliament())
  }

  hasRoyalAssent () {
    const currentState = this.getDataInAttribute('Events', 'laagCurrentStage', true)
    return currentState === 'RoyalAssentGiven'
  }

  isInCurrentParliament () {
    if (typeof this.currentParliament === 'undefined') {
      throw new ParliamentNotSetError('Must specify what the current parliament is if it is used as a filter.')
    }

    const parliamentNumber = Number(this.getDataInAttribute('ParliamentSession', 'parliamentNumber', true))
    const parliamentSession = Number(this.getDataInAttribute('ParliamentSession', 'sessionNumber', true))
    return this.currentParliament.number === parliamentNumber && this.currentParliament.session === parliamentSession
  }
}

BillXmlParser.defaultFilters = {
  mustHaveRoyalAssent: false,
  mustBeInCurrentParliament: false
}

module.exports.BillXmlParser = BillXmlParser
