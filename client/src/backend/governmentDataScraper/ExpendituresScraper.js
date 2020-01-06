import { FileReader } from '../../scraper/job_actions/UrlFileReaderAction'
import { FinancialRecord } from '../../models/FinancialRecord'
import { Firestore as FireStore } from '../../Firebase'

const cheerio = require('cheerio')

class ExpendituresScraper {
  constructor (fp) {
    this.reader = new FileReader(fp)
    this.parser = null
  }

  async createExpenditureRecords () {
    return this.reader.perform()
      .then(this.createParser.bind(this))
      .then(this.expendituresByMember.bind(this))
      .then(this.memberExpendituresByCategory.bind(this))
      .then(this.findExpenditureSubCategories.bind(this))
      .then(this.produceFinancialCategories.bind(this))
      .catch(this.handleErrors.bind(this))
  }

  createParser (xml) {
    console.debug('INFO: creating parser..')
    this.parser = cheerio.load(xml, {
      normalizeWhitespace: true,
      xmlMode: true
    })
    return this.parser
  }

  expendituresByMember (parser) {
    console.debug('INFO: finding expenditures by member...')
    const memberExpenditures = []
    const expenditureReports = parser('MemberExpenditureReports').children('Report')
    expenditureReports.each((index, report) => {
      memberExpenditures.push({
        date: this.findDateInReport(report),
        riding: this.findRidingInReport(report),
        content: this.createContent(report),
        categories: []
      })
    })
    return memberExpenditures
  }

  findDateInReport (report) {
    const date = report.children.find((elem) => {
      return elem.name === 'StartDate'
    })
    return date.children[0].data
  }

  findRidingInReport (report) {
    const constituency = report.children.find((elem) => {
      return elem.name === 'Constituency'
    })
    return constituency.attribs['name-en']
  }

  createContent (report) {
    const categories = report.children.find((elem) => {
      return elem.name === 'ExpenditureCategories'
    })
    return categories
  }

  memberExpendituresByCategory (memberExpenditures) {
    console.debug('INFO: Parsing for expense categories of each member..')
    memberExpenditures.forEach(report => {
      report.content.children.forEach((category) => {
        report.categories.push(category)
      })
    })
    return memberExpenditures
  }

  findExpenditureSubCategories (categoryExpenditures) {
    console.debug('INFO: Parsing for expense subcategories of each member..')
    categoryExpenditures.forEach(report => {
      const categories = report.categories
      categories.forEach(cat => {
        cat.parent = ''
        this.findSubCategories(cat, report)
      })
    })
    return categoryExpenditures
  }

  findSubCategories (category, report) {
    category.children.forEach((subcategory) => {
      this.filterSubCategories(category, subcategory, report)
    })
  }

  filterSubCategories (category, subcat, report) {
    if (subcat.name !== 'SubCategories') {
      return
    }
    subcat.children.forEach(cat => {
      if (cat.name === 'Category') {
        cat.parent = this.getCategoryName(category)
        report.categories.push(cat)
      }
    })
  }

  async produceFinancialCategories (results) {
    const ret = await this.generateFinancialRecords(results)
    return ret
  }

  async generateFinancialRecords (records) {
    console.debug('INFO: Producing financial records..')
    const financialRecords = []
    await Promise.all(
      records.map(async (record) => {
        await this.retrievePolitician(record.riding)
          .then(id => {
            record.categories.forEach(cat => {
              let fr = null
              try {
                fr = this.createFinancialRecord(id, record.date, cat)
                financialRecords.push(fr)
              } catch (e) {
                console.debug('DEBUG: ' + e.message)
              }
            })
          })
          .catch(console.error)
      }))
    return financialRecords
  }

  createFinancialRecord (id, date, category) {
    const year = this.computeYear(date)
    const quarter = this.computeQuarter(date)
    const name = this.getCategoryName(category)
    const parent = category.parent
    let amount = this.getCategorySpendingAmount(category)

    if (isNaN(amount)) {
      console.warn(`Financial Record ${name} for member ${id} has a non-numeric value. Value will be set to zero.`)
      amount = 0
    }

    return new FinancialRecord(id, parent, name, amount, year, quarter)
  }

  retrievePolitician (riding) {
    const fs = new FireStore()
    return fs.Politician()
      .where('riding', '==', riding.toLowerCase())
      .select()
      .then(snapshot => {
        if (snapshot.empty || snapshot.size !== 1) {
          throw Error(`ERROR: Riding: ${riding} not found`)
        }
        let id = ''
        snapshot.forEach(doc => {
          id = doc.id
        })
        return id
      })
      .catch(e => {
        throw e
      })
  }

  computeQuarter (date) {
    return Number(date.substring(6, 6)) % 3 + 1
  }

  computeYear (date) {
    return Number(date.substring(0, 4))
  }

  getCategoryName (category) {
    return category.attribs['name-en']
  }

  getCategorySpendingAmount (category) {
    const total = category.children.find(elem => {
      return elem.name === 'Total'
    })
    return Number(total.attribs.value)
  }

  handleErrors (e) {
    throw e
  }
}

module.exports.ExpendituresScraper = ExpendituresScraper
