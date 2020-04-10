require('module-alias/register')
const Components = require('@manager')
const Errors = require('../error/errors')
const flatten = require('flat')

const Parameters = require('@parameter')

class BillScraper extends Components.QueueManager {
  static create(params, wait = 5000) {
    const manager = new BillScraper(params, wait)
    manager
      .setStartAction(new Components.Start.Bill(manager))
      .setStopAction(new Components.Stop.Generic(manager))
      .setErrorAction(new Components.Error.Parse(manager))
      .setLogAction(new Components.Log.Typed(BillScraper))
    return manager
  }

  finish() {
    console.log(`INFO: ${BillScraper.name}: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }

  constructor(params, wait = 5000) {
    super(wait)
    this.parliaments = []
    this.setParliaments(params.parliaments)
    this.sessions = []
    this.setSessions(params.sessions)

    if (this.sessions.length === 1 && this.parliaments.length > 1) {
      throw new Errors.InvalidParameterError('ERROR: no session data provided when specifying a parliament, will not be able to query')
    }

    this.originatingChambers = []
    this.setOriginatingChambers(params.originatingChambers)
    this.billTypes = []
    this.setBillTypes(params.billTypes)
    this.sponsorAffiliations = []
    this.setSponsorAffiliation(params.sponsorAffiliations)
    this.sponsors = []
    this.setSponsors(params.sponsors)
    this.statuses = []
    this.setStatuses(params.statuses)
    this.params = []
    this.createQueries(params.url)
    this.queryCount = this.params.length
    this.maxQueryCount = this.params.length
  }

  setParliaments(parliaments) {
    if (typeof parliaments === 'undefined' ||
      (typeof parliaments === 'string' && parliaments.toLowerCase().includes('all'))) {
      this.parliaments.push(' ')
    } else if (Array.isArray(parliaments)) {
      this.parliaments = parliaments.filter(parliament => {
        return parliament > 35
      })
    }
  }

  setSessions(sessions) {
    if (typeof sessions === 'undefined' ||
      (sessions instanceof String && sessions.toLowerCase().includes('all'))) {
      this.sessions.push(' ')
    } else if (Array.isArray(sessions)) {
      this.sessions = sessions.filter(session => {
        return session >= 1 && session <= 4
      })
    }
  }

  setOriginatingChambers(originatingChambers) {
    if (typeof originatingChambers === 'undefined' ||
      (originatingChambers instanceof String && originatingChambers.toLowerCase().includes('all'))) {
      this.originatingChambers.push(' ')
    } else if (Array.isArray(originatingChambers)) {
      this.originatingChambers = originatingChambers.filter(chamber => {
        return Object.values(Parameters.BillParameters.Chambers).includes(chamber)
      })
    }
  }

  setBillTypes(billTypes) {
    if (typeof billTypes === 'undefined' ||
      (billTypes instanceof String && billTypes.toLowerCase().includes('all'))) {
      this.billTypes.push(' ')
    } else if (Array.isArray(billTypes)) {
      this.billTypes = billTypes.filter(type => {
        return Object.values(flatten(Parameters.BillParameters.Type)).includes(type)
      })
    }
  }

  setSponsorAffiliation(sponsorAffiliations) {
    if (typeof sponsorAffiliations === 'undefined' ||
      (sponsorAffiliations instanceof String && sponsorAffiliations.toLowerCase().includes('all'))) {
      this.sponsorAffiliations.push(' ')
    } else if (Array.isArray(sponsorAffiliations)) {
      this.sponsorAffiliations = sponsorAffiliations.filter(type => {
        return Object.values(Parameters.BillParameters.Affiliation).includes(type)
      })
    }
  }

  setSponsors(sponsors) {
    if (typeof sponsors === 'undefined' ||
      (sponsors instanceof String && sponsors.toLowerCase().includes('all'))) {
      this.sponsors.push(' ')
    } else if (Array.isArray(sponsors)) {
      this.sponsors = sponsors
    }
  }

  setStatuses(statuses) {
    if (typeof statuses === 'undefined' ||
      (statuses instanceof String && statuses.toLowerCase().includes('all'))) {
      this.statuses.push(' ')
    } else if (Array.isArray(statuses)) {
      this.statuses = statuses.filter(type => {
        return Object.values(flatten(statuses)).includes(type)
      })
    }
  }

  createQueries(url) {
    this.billTypes.forEach(type => {
      this.statuses.forEach(status => {
        this.sponsorAffiliations.forEach(affiliation => {
          this.sponsors.forEach(sponsor => {
            this.originatingChambers.forEach(chamber => {
              this.parliaments.forEach(parl => {
                this.sessions.forEach(session => {
                  const param = {}
                  param.url = url
                  if (parl !== ' ' && session !== ' ') {
                    param.ParliamentSession = `${parl}-${session}`
                  }
                  if (type !== ' ') {
                    param.BillType = type
                  }
                  if (status !== ' ') {
                    param.BillStatus = status
                  }
                  if (affiliation !== ' ') {
                    param.BillSponsorAffiliation = affiliation
                  }
                  if (sponsor !== ' ') {
                    param.BillSponsor = sponsor
                  }
                  if (chamber !== ' ') {
                    param.OriginatingChamber = chamber
                  }
                  param.Language = 'E'
                  param.download = 'xml'
                  param.url = this.appendQueryStringToURL(url, param)
                  this.params.push(param)
                })
              })
            })
          })
        })
      })
    })
  }

  appendQueryStringToURL(url, param) {
    // I hate that this function needs to exist
    // I would use C/CGI if I wanted to do this
    let fullString = `${url}?`
    let first = true
    if (param.ParliamentSession) {
      fullString = `${fullString}${first ? '' : '&'}ParliamentSession=${param.ParliamentSession}`
      first = false
    }
    if (param.BillType) {
      fullString = `${fullString}${first ? '' : '&'}BillType=${param.BillType}`
      first = false
    }
    if (param.BillStatus) {
      fullString = `${fullString}${first ? '' : '&'}BillStatus=${param.BillStatus}`
      first = false
    }
    if (param.BillSponsorAffiliation) {
      fullString = `${fullString}${first ? '' : '&'}BillSponsorAffiliation=${param.BillSponsorAffiliation}`
      first = false
    }
    if (param.BillSponsor) {
      fullString = `${fullString}${first ? '' : '&'}BillSponsor=${param.BillSponsor}`
      first = false
    }
    if (param.OriginatingChamber) {
      fullString = `${fullString}${first ? '' : '&'}OriginatingChamber=${param.OriginatingChamber}`
      first = false
    }
    return `${fullString}${first ? '' : '&'}Language=E&download=xml`
  }
}

module.exports.BillScraper = BillScraper
