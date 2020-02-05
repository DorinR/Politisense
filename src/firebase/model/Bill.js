const Condition = require('../../util/utils').Condition
const Model = require('./Model').Model

class Bill extends Model {
  constructor (id, number, title, text, link, dateVoted, sponsorName) {
    super()
    Condition.parameter(id).isType(Number)
    Condition.parameter(number).isType(String)
    Condition.parameter(title).isType(String)
    Condition.parameter(text).isType(String)
    Condition.parameter(link).isType(String)
    Condition.parameter(dateVoted).isType(String)
    Condition.parameter(sponsorName).isType(String)

    this.id = id
    this.number = number
    this.title = title
    this.text = text
    this.link = link
    this.dateVoted = dateVoted
    this.sponsorName = sponsorName
  }

  static deserialise (json) {
    return Model.deserialise(json, new Bill(1, '', '', '', '', '', ''))
  }

  static builder (id) {
    return new BillBuilder(id)
  }
}

class BillBuilder {
  constructor (id) {
    this.id = id
    this.text = ''
  }

  withNumber (number) {
    this.number = number
    return this
  }

  withTitle (title) {
    this.title = title
    return this
  }

  withText (text) {
    this.text = text
    return this
  }

  withLink (link) {
    this.link = link
    return this
  }

  withDateVoted (dateVoted) {
    this.dateVoted = dateVoted
    return this
  }

  withSponsorName (sponsorName) {
    this.sponsorName = sponsorName
    return this
  }

  build () {
    return new Bill(this.id, this.number, this.title, this.text, this.link, this.dateVoted, this.sponsorName)
  }
}

module.exports.Bill = Bill
