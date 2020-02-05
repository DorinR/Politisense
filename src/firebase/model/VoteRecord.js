<<<<<<< HEAD
const Condition = require('../../util/Condition').Condition
const Model = require('./Model').Model

class VoteRecord extends Model {
  constructor (type, year, month, billNumber, id, name, yeas, nays) {
=======
const Condition = require('../../util/utils').Condition
const Model = require('./Model').Model

class VoteRecord extends Model {
  constructor (billNumber, id, name, voters, yeas, nays) {
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
    super()
    Condition.parameter(billNumber).isType(String)
    Condition.parameter(id).isType(Number)
    Condition.parameter(yeas).isType(Number)
    Condition.parameter(nays).isType(Number)
    Condition.parameter(name).isType(String)
<<<<<<< HEAD
    Condition.parameter(type).isType(String)
    Condition.parameter(year).isType(Number)
    Condition.parameter(month).isType(Number)

    this.billNumber = billNumber
    this.bill = '' // cannot be known when first creating this type of record
    this.id = id
    this.name = name
    this.yeas = yeas
    this.nays = nays
    this.type = type
    this.year = year
    this.month = month
  }

  static deserialise (json) {
    return Model.deserialise(json, new VoteRecord('', 0, 0, '', 0, 0, 0, 0))
=======
    Condition.parameter(voters).isType(Object)

    this.billNumber = billNumber
    this.id = id
    this.name = name
    this.voters = voters
    this.yeas = yeas
    this.nays = nays
    this.assent = Boolean(yeas > nays)
  }

  static deserialise (json) {
    return Model.deserialise(json, new VoteRecord('', 0, 0, 0, 0, 0))
  }

  static builder (id) {
    return new VoteRecordBuilder(id)
  }
}

class VoteRecordBuilder {
  constructor (id) {
    this.id = id
    this.voters = {}
  }

  withBillNumber (billNumber) {
    this.billNumber = billNumber
    return this
  }

  withName (name) {
    this.name = name
    return this
  }

  withVoters (voters) {
    this.voters = voters
    return this
  }

  withYeas (yeas) {
    this.yeas = yeas
    return this
  }

  withNays (nays) {
    this.nays = nays
    return this
  }

  build () {
    return new VoteRecord(this.billNumber, this.id, this.name, this.voters, this.yeas, this.nays)
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  }
}

module.exports.VoteRecord = VoteRecord
