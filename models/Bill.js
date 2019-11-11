const Condition = require('./Condition').Condition

class Bill {
  constructor (id, number, title, text, link, dateVoted, sponsorName) {
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
}

export { Bill }
