const Condition = require('../../util/Condition').Condition
const Model = require('./Model').Model

class FinancialRecord extends Model {
  constructor (memberID, parentCategory, category, amount, year, quarter) {
    super()
    Condition.parameter(memberID).isType(String)
    Condition.parameter(parentCategory).isType(String)
    Condition.parameter(category).isType(String)
    Condition.parameter(amount)
      .isType(Number)
      .isMoreThanOrEqual(0)
    Condition.parameter(year)
      .isType(Number)
      .isMoreThanOrEqual(0)
    Condition.parameter(quarter)
      .isType(Number)
      .isMoreThanOrEqual(0)

    this.member = memberID
    this.parent = parentCategory
    this.category = category
    this.amount = amount
    this.year = year
    this.quarter = quarter
  }

  static deserialise (json) {
    return Model.deserialise(json,
      new FinancialRecord('', '', '', 0, 0, 0)
    )
  }
}

module.exports.FinancialRecord = FinancialRecord
