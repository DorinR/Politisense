<<<<<<< HEAD
const Condition = require('../../util/Condition').Condition
const Model = require('./Model').Model

class Politician extends Model {
  constructor (name, party, riding, start, end, imageUrl) {
=======
const Condition = require('../../util/utils').Condition
const Model = require('./Model').Model

class Politician extends Model {
  constructor (name, party, riding, yearElected, imageUrl) {
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
    super()
    Condition.parameter(name).isType(String)
    Condition.parameter(party).isType(String)
    Condition.parameter(riding).isType(String)
<<<<<<< HEAD
    Condition.parameter(start).isType(Number)
    Condition.parameter(end).isType(Number)
=======
    Condition.parameter(yearElected).isType(Number)
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
    Condition.parameter(imageUrl).isType(String)

    this.name = name
    this.party = party
    this.riding = riding
<<<<<<< HEAD
    this.start = start
    this.end = end
=======
    this.yearElected = yearElected
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
    this.imageUrl = imageUrl
  }

  static deserialise (json) {
    return Model.deserialise(json, new Politician('', '', '', 0, ''))
  }

  static builder (name) {
    return new PoliticianBuilder(name)
  }
}

class PoliticianBuilder {
  constructor (name) {
    this.name = name
<<<<<<< HEAD
    this.imageUrl = 'placeholder'
=======
    this.imageUrl = ''
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  }

  withParty (party) {
    this.party = party
    return this
  }

  withRiding (riding) {
    this.riding = riding
    return this
  }

<<<<<<< HEAD
  withStartYear (year) {
    this.start = year
    return this
  }

  withEndYear (year) {
    this.end = year
=======
  withYearElected (yearElected) {
    this.yearElected = yearElected
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
    return this
  }

  withImageUrl (imageUrl) {
    this.imageUrl = imageUrl
    return this
  }

  build () {
<<<<<<< HEAD
    return new Politician(this.name, this.party, this.riding, this.start, this.end, this.imageUrl)
=======
    return new Politician(this.name, this.party, this.riding, this.yearElected, this.imageUrl)
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  }
}

module.exports.Politician = Politician
