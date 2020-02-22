require('module-alias/register')
const Utils = require('@utils')
const FetchAction = require('@action').FetchAction
const QueueManager = Utils.QueueManager.QueueManager
const StartAction = Utils.QueueManager.Start.StartVoteScrape
const StopAction = Utils.QueueManager.Stop.StopVoteScrape
const Throw = Utils.QueueManager.Error.ParseErrorAction

const cheerio = require('cheerio')

const defaultUrl = 'https://www.ourcommons.ca/Members/en/votes/xml'

let Parliament

const BillType = {
  houseGovernment: 3,
  privateMember: 4,
  senateGovernment: 80759,
  senatePublic: 80760,
  senatePrivate: 80761
}

const Result = {
  agreedTo: 15,
  negatived: 16,
  tie: 17
}

async function getParliamentIDMap () {
  const votesPageUrl = 'https://www.ourcommons.ca/Members/en/votes'
  const html = await getVotesPageHtml(votesPageUrl)

  const $ = cheerio.load(html)
  const parliamentMap = {}
  $('li', 'ul[aria-labelledby="parlSession"]').each((i, parlData) => {
    const numbersFromParlText = $(parlData).text().match(/\d+/g).map(Number)
    const parlNumber = numbersFromParlText[0]
    const session = numbersFromParlText[1]
    const key = `${parlNumber}-${session}`
    parliamentMap[key] = Number($('a', parlData).eq(0).attr('data-value'))
  })

  return parliamentMap
}

async function populateParliamentData () {
  if (typeof Parliament === 'undefined') {
    Parliament = await getParliamentIDMap()
  }
}

async function getVotesPageHtml (url) {
  return new FetchAction({ url: url }).perform()
    .then(html => { return html })
    .catch(e => {
      console.error(e.message)
      return ''
    })
}

class VoteScraper extends QueueManager {
  static create (params, wait = 5000) {
    const manager = new VoteScraper(params, wait)
    manager
      .setStartAction(new StartAction(manager))
      .setStopAction(new StopAction(manager))
      .setErrorAction(new Throw(manager))
    return manager
  }

  constructor (params, wait = 5000) {
    super(wait)
    this.parliaments = []
    this.setParliaments(params.parliaments)
    this.billTypes = []
    this.setBillTypes(params.billTypes)
    this.results = []
    this.setResults(params.results)
    this.dateRanges = []
    this.setDateRanges(params.dateRanges)
    this.billIds = []
    this.setBillIds(params.billIds)

    this.params = []
    this.createQueries(params.url)
    this.queryCount = this.params.length
  }

  async run () {
    await super.run()
  }

  accumulate (result) {
    this.result.push(result)
    return result
  }

  setParliaments (parliaments) {
    if (typeof parliaments === 'undefined' ||
      (typeof parliaments === typeof ' ' && parliaments.toLowerCase().includes('all'))) {
      this.parliaments = Object.values(Parliament)
    }
    if (typeof parliaments === typeof []) {
      const validParliaments = Object.values(Parliament)
      this.parliaments = parliaments.filter(parl => {
        return validParliaments.includes(parl)
      })
    }
  }

  setBillTypes (billTypes) {
    if (typeof billTypes === 'undefined' ||
      (typeof billTypes === typeof ' ' && billTypes.toLowerCase().includes('all'))) {
      this.billTypes.push('')
    }
    if (typeof billTypes === typeof []) {
      const validBillTypes = Object.values(BillType)
      this.billTypes = billTypes.filter(type => {
        return validBillTypes.includes(type)
      })
    }
  }

  setResults (results) {
    if (typeof results === 'undefined' ||
      (typeof results === typeof ' ' && results.toLowerCase().includes('all'))) {
      this.results.push('')
    }
    if (typeof results === typeof []) {
      const validResult = Object.values(Result)
      this.results = results.filter(type => {
        return validResult.includes(type)
      })
    }
  }

  setDateRanges (dateRanges) {
    if (typeof dateRanges === 'undefined' ||
      (typeof dateRanges === typeof ' ' && dateRanges.toLowerCase().includes('all'))) {
      this.dateRanges.push(['', ''])
    }
    if (typeof dateRanges === typeof []) {
      this.dateRanges = dateRanges.filter(dateRange => {
        return this.isValidDateRange(dateRange)
      })
    }
  }

  setBillIds (billIds) {
    if (typeof billIds === 'undefined' ||
      (typeof billIds === typeof ' ' && billIds.toLowerCase().includes('all'))) {
      this.billIds.push('')
    }
    if (typeof billIds === typeof []) {
      this.billIds = billIds.filter(id => typeof id === typeof 'number')
    }
  }

  isValidDateRange (dateRange) {
    if (typeof dateRange !== typeof [] || dateRange.length !== 2) {
      return false
    }

    for (const date of dateRange) {
      if (!this.isValidDate(date)) {
        return false
      }
    }

    return true
  }

  isValidDate (date) {
    if (typeof date !== typeof '') {
      return false
    }
    const dateAsArray = date.split('-')
    if (dateAsArray.length !== 3 || dateAsArray.some(el => typeof el !== 'number')) {
      return false
    }
    return true
  }

  createQueries (url) {
    this.parliaments.forEach(parliament => {
      this.billTypes.forEach(billType => {
        this.results.forEach(result => {
          this.dateRanges.forEach(dateRange => {
            this.billIds.forEach(billId => {
              this.params.push({
                url: url,
                params: {
                  parlSession: parliament,
                  billDocumentTypeId: billType,
                  decisionResultId: result,
                  fromDate: dateRange[0],
                  toDate: dateRange[1],
                  billDocumentId: billId
                }
              })
            })
          })
        })
      })
    })
  }
}

module.exports.VoteScraper = VoteScraper

populateParliamentData().then(res => {
  console.log(Parliament)
  VoteScraper.create({
    url: defaultUrl,
    parliaments: 'all'
  })
    .execute()
    .then(result => {
      console.log(result)
    })
})