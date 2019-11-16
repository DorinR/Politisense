import { Condition } from './Condition'
const Model = require('./Model').Model

class FinancialRecord extends Model {
  constructor (memberID, parentCategory, category, amount, year, quarter) {
    super ()
    Condition.parameter(memberID).isType(Number)
    Condition.parameter(parentCategory).isType(String)
    Condition.parameter(category).isType(String)
    Condition.parameter(amount).isType(Number)
    Condition.parameter(year).isType(Number)
    Condition.parameter(quarter).isType(Number)

    this.member = memberID
    this.parent = parentCategory
    this.category = category
    this.amount = amount
    this.year = year
    this.quarter = quarter
  }
}