import { Condition } from './Condition'
const Model = require('./Model').Model

class Riding extends Model {
  constructor(code, nameEnglish, nameFrench, population) {
    super()
    Condition.parameter(code).isType(Number)
    Condition.parameter(nameEnglish).isType(String)
    Condition.parameter(nameFrench).isType(String)
    Condition.parameter(population).isType(Number)

    this.code = code
    this.nameEnglish = nameEnglish
    this.nameFrench = nameFrench
    this.population = population
  }

  static deserialise(json) {
    return Model.deserialise(json, new Riding('', '', '', ''))
  }
}

module.exports.Riding = Riding
