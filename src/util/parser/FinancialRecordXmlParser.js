require('module-alias/register')
const Parser = require('./XmlDataParser').XmlDataParser
const FinancialRecord = require('@model').FinancialRecord

class _FinancialSubCategoryXmlParser extends Parser {
  constructor (xml, year, quarter, parent, riding) {
    super(xml)
    this.year = year
    this.quarter = quarter
    this.parent = parent
    this.riding = riding
  }

  get tagName () {
    return 'Category'
  }

  get listTagName () {
    return 'SubCategories'
  }

  generateNewParser (xml) {
    return new _FinancialSubCategoryXmlParser(xml, this.year, this.quarter, this.parent, this.riding)
  }

  buildJson () {
    const value = this.getDataInAttribute('MembersBudget', 'value')
    const category = this.getDataInAttribute('Category', 'name-en')
    return new FinancialRecord(
      this.riding,
      this.parent,
      category,
      Number(value),
      Number(this.year),
      Number(this.quarter)
    )
  }
}

class _FinancialCategoryXmlParser extends Parser {
  constructor (xml, year, quarter, riding) {
    super(xml)
    this.year = year
    this.quarter = quarter
    this.riding = riding
    this.spendingCategories = [1,2,3,4,5,6,7,8]
  }

  get tagName () {
    return 'Category'
  }

  get listTagName () {
    return 'ExpenditureCategories'
  }

  generateNewParser (xml) {
    return new _FinancialCategoryXmlParser(xml, this.year, this.quarter, this.riding)
  }

  buildJson () {
    const categoryName = this.getDataInAttribute('Category', 'name-en')
    const value = this.getDataInAttribute('MembersBudget', 'value')
    const parent = ''
    const category = new FinancialRecord(
      this.riding,
      parent,
      categoryName,
      Number(value),
      Number(this.year),
      Number(this.quarter)
    )
    const records = new _FinancialSubCategoryXmlParser(
      this.getXmlInTag('SubCategories'),
      this.year,
      this.quarter,
      this.getDataInAttribute('Category', 'name-en'),
      this.riding
    ).getAllFromXml()
    records.push(category)
    return records
  }

  getAllFromXml (onlyFromListTag = false) {
    const records = super.getAllFromXml(onlyFromListTag)
    return records
      .flat(Infinity)
      .filter(record => {
        return (record.parent === '' && this.spendingCategories.some(cat => {return record.category.includes(cat)})) ||
          (record.parent !== '' && this.spendingCategories.every(cat => {return !record.category.includes(cat)}))
      })

  }
}

class FinancialReportXmlParser extends Parser {
  constructor (xml) {
    super(xml)
  }

  get tagName () {
    return 'Report'
  }

  get listTagName () {
    return 'MemberExpenditureReports'
  }

  static computeQuarter (date) {
    return Number(date.substring(6, 6)) % 3 + 1
  }

  static computeYear (date) {
    return Number(date.substring(0, 4))
  }

  generateNewParser (xml) {
    return new FinancialReportXmlParser(xml)
  }

  buildJson () {
    const date = this.getDataInTag('StartDate')
    const year = FinancialReportXmlParser.computeYear(date)
    const quarter = FinancialReportXmlParser.computeQuarter(date)
    const riding = this.getDataInAttribute('Constituency','name-en')

    const newXML = this.getXmlInTag('Report')
    return new _FinancialCategoryXmlParser(newXML, year, quarter, riding).getAllFromXml()
  }

  getAllFromXml (onlyFromListTag = false) {
    const records = super.getAllFromXml(onlyFromListTag)
    return records.flat(Infinity)
  }
}

module.exports = {
  FinancialRecordXmlParser: FinancialReportXmlParser
}
