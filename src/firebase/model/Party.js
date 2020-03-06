const Model = require('./Model').Model
const Condition = require('@utils').Condition

class Party extends Model {
  constructor (name, seats, imageUrl) {
    super()
    Condition.parameter(name).isType(String)
    Condition.parameter(seats).isType(Number)
    Condition.parameter(imageUrl).isType(String)

    this.name = name
    this.seats = seats
    this.imageUrl = imageUrl
  }

  static deserialise (json) {
    return Model.deserialise(json, new Party('', 0, ''))
  }
}