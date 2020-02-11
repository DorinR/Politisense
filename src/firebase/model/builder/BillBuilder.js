const Bill = require('../Bill').Bill

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

module.exports = {
  BillBuilder: BillBuilder
}