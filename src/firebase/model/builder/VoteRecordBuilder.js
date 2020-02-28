const VoteRecord = require('../VoteRecord').VoteRecord

class VoteRecordBuilder {
  constructor (id) {
    this.id = id
  }

  withBillNumber (billNumber) {
    this.billNumber = billNumber
    return this
  }

  withName (name) {
    this.name = name
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

  withType(type) {
    this.type = type
    return this
  }

  withYear(year) {
    this.year = year
    return this
  }
  withMonth(month) {
    this.month = month
    return this
  }

  build () {
    return new VoteRecord(this.type, this.year, this.month, this.billNumber, this.id, this.name, this.yeas, this.nays)
  }
}

module.exports.VoteRecordBuilder = VoteRecordBuilder