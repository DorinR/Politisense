import { XmlDataParser } from './XmlDataParser'

class CurrentParliamentNotSpecifiedError extends Error {
  constructor (msg) {
    super()
    this.message = msg
    this.name = this.constructor.name
  }
}

class BillXmlParser extends XmlDataParser {
  constructor (xml, filters = undefined, currentParliament = undefined) {
    super(xml)
    this.filters = Object.assign({}, BillXmlParser.defaultFilters, filters)
    this.currentParliament = currentParliament
  }

  get TAG_NAME () {
    return 'Bill'
  }

  get LIST_TAG_NAME () {
    return 'Bills'
  }

  generateNewParser (xml) {
    return new BillXmlParser(xml, this.filters, this.currentParliament)
  }

  xmlToJson () {
    if (!this.passesFilters()) {
      return null
    }

    const bill = {}
    try {
      bill.id = Number(this.getDataInAttribute(this.TAG_NAME, 'id'))
      bill.number = this.getDataInAttribute('BillNumber', 'prefix') + '-' +
        this.getDataInAttribute('BillNumber', 'number')
      bill.title = this.$('BillTitle').find('Title[language=\'en\']').text().trim()
      const sponsorName = this.$('SponsorAffiliation').find('FirstName').text() + ' ' + this.$('SponsorAffiliation').find('LastName').text()
      bill.sponsorName = sponsorName.toLowerCase()
      bill.link = this.getLinkToBillText()
      bill.dateVoted = this.formatXmlDate(this.getDataInTag('BillIntroducedDate'))
    } catch (e) {
      console.debug(e.message)
      return null
    }

    // async data, added separately
    bill.text = '' // TODO: get the bill text when getting from online

    return bill
  }

  getLinkToBillText () {
    let link = ''
    this.$('Publications').find('Publication').each((i, pub) => {
      const isRoyalAssent = this.$(pub).find('Title').text().includes('Royal Assent')
      if (isRoyalAssent) {
        link = this.$(pub).find('PublicationFile[language=\'en\']').attr('relativePath').replace('//', 'https://www.')
      }
    })
    return link
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
      throw new CurrentParliamentNotSpecifiedError('Must specify what the current parliament is if it is used as a filter.')
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
