require('module-alias/register')
const Components = require('@manager')
const Errors = require('../error/errors')
const flatten = require('flat')

const Chambers = {
  senate: 'Senate',
  commons: 'House+of+Commons'
}

const Affiliations = {
  BlocQuebecois: 'Bloc+Québécois',
  CanadianAlliance: 'Canadian+Alliance',
  CanadianSenatorsGroup: 'Canadian+Senators+Group',
  Conservative: 'Conservative',
  ConservativeIndependent: 'Conservative+Independent',
  ForcesEtDemocratie: 'Forces+et+Démocratie',
  GreenParty: 'Green+Party',
  Independent: 'Independent',
  IndependentConservative: 'Independent+Conservative',
  IndependentSenatorsGroup: 'Independent+Senators+Group',
  Liberal: 'Liberal',
  NDP: 'NDP',
  NonAffiliated: 'Non-affiliated',
  PC: 'PC',
  PCDR: 'PC%2fDR'
}

const BillTypes = {
  senate: {
    government: 'Senate+Government+Bill',
    public: 'Senate+Public+Bill',
    private: 'Senate+Private+Bill'
  },

  house: {
    government: 'House+Government+Bill'
  },

  member: {
    private: 'Private+Member%e2%80%99s+Bill'
  }
}

const BillStatuses = {

  general: {
    assented: 'RoyalAssentGiven',
    defeated: 'BillDefeated',
    tabled: 'WillNotBeProceededWith'
  },

  house: {
    readings: {
      first: 'HouseAt1stReading',
      second: 'HouseAt2ndReading',
      third: 'HouseAt3rdReading'
    },

    reports: {
      report: 'HouseAtReportStage',
      beforeReading2: 'HouseAtReportStageAndSecondReading'
    },

    committee: {
      beforeReading2: 'HouseAtReferralToCommitteeBeforeSecondReading',
      current: 'HouseInCommittee'
    },

    amendment: {
      consideration: 'HouseConsiderationOfAmendments'
    }
  },

  senate: {

    readings: {
      first: 'SenateAt1stReading',
      second: 'SenateAt2ndReading',
      third: 'SenateAt3rdReading'
    },

    amendment: {
      consideration: 'SenateConsiderationOfAmendments'
    },

    committee: {
      consideration: 'SenateConsiderationOfCommitteeReport',
      current: 'SenateInCommittee'
    }
  }
}

class BillScraper extends Components.QueueManager {
  static create (params, wait = 5000) {
    const manager = new BillScraper(params)
    manager
      .setStartAction(new Components.Start.Bill(manager))
      .setStopAction(new Components.Stop.GenericStopAction(manager))
      .setErrorAction(new Components.Error.ParseErrorAction(manager))
    return manager
  }

  requeueCallback (jobs) {
    super.requeueCallback(jobs)
    this.queryCount++
  }

  async execute () {
    try {
      const partialResults = await this.start()
      this.accumulate(partialResults)
    } catch (e) {
      this.queryCount--
    }
    await this.run()
    return this.result
  }

  async run () {
    await super.run()
    this.finish()
  }

  accumulate (result) {
    this.result.push(result)
    return result
  }

  finish () {
    console.log(`INFO: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }

  constructor (params, wait = 5000) {
    super(wait)
    this.parliaments = []
    this.setParliaments(params.parliaments)
    this.sessions = []
    this.setSessions(params.sessions)

    if (this.sessions.length === 0 && this.parliaments.length !== 0) {
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

  setParliaments (parliaments) {
    if (typeof parliaments === 'undefined' ||
        (parliaments instanceof String && parliaments.toLowerCase().includes('all'))) {
      this.parliaments.push(' ')
    } else if (typeof parliaments === typeof []) {
      this.parliaments = parliaments.filter(parliament => {
        return parliament > 35
      })
    }
  }

  setSessions (sessions) {
    if (typeof sessions === 'undefined' ||
      (sessions instanceof String && sessions.toLowerCase().includes('all'))) {
      this.sessions.push(' ')
    } else if (typeof sessions === typeof []) {
      this.sessions = sessions.filter(session => {
        return session >= 1 && session <= 4
      })
    }
  }

  setOriginatingChambers (originatingChambers) {
    if (typeof originatingChambers === 'undefined' ||
      (originatingChambers instanceof String && originatingChambers.toLowerCase().includes('all'))) {
      this.originatingChambers.push(' ')
    } else if (typeof originatingChambers === typeof []) {
      this.originatingChambers = originatingChambers.filter(chamber => {
        return Object.values(Chambers).includes(chamber)
      })
    }
  }

  setBillTypes (billTypes) {
    if (typeof billTypes === 'undefined' ||
      (billTypes instanceof String && billTypes.toLowerCase().includes('all'))) {
      this.billTypes.push(' ')
    } else if (typeof billTypes === typeof []) {
      this.billTypes = billTypes.filter(type => {
        return Object.values(flatten(BillTypes)).includes(type)
      })
    }
  }

  setSponsorAffiliation (sponsorAffiliations) {
    if (typeof sponsorAffiliations === 'undefined' ||
      (sponsorAffiliations instanceof String && sponsorAffiliations.toLowerCase().includes('all'))) {
      this.sponsorAffiliations.push(' ')
    } else if (typeof sponsorAffiliations === typeof []) {
      this.sponsorAffiliations = sponsorAffiliations.filter(type => {
        return Object.values(Affiliations).includes(type)
      })
    }
  }

  setSponsors (sponsors) {
    if (typeof sponsors === 'undefined' ||
      (sponsors instanceof String && sponsors.toLowerCase().includes('all'))) {
      this.sponsors.push(' ')
    } else if (typeof sponsors === typeof []) {
      this.sponsors = sponsors
    }
  }

  setStatuses (statuses) {
    if (typeof statuses === 'undefined' ||
      (statuses instanceof String && statuses.toLowerCase().includes('all'))) {
      this.statuses.push(' ')
    } else if (typeof statuses === typeof []) {
      this.statuses = statuses.filter(type => {
        return Object.values(flatten(statuses)).includes(type)
      })
    }
  }

  createQueries (url) {
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

  appendQueryStringToURL (url, param) {
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

module.exports = {
  BillScraper: BillScraper,
  Chambers: Chambers,
  Affiliations: Affiliations,
  BillTypes: BillTypes,
  BillStatuses: BillStatuses
}

