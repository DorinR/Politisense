/* eslint-env jest */
const VoteScraper = require('../../../data/scraper/VoteScraper').VoteScraper
const BillType = require('../../../data/scraper/VoteScraper').VoteScraperBillType
const Result = require('../../../data/scraper/VoteScraper').VoteScraperResult

describe('VoteScraper Dates', () => {
  it('should accept YYYY-MM-DD date format', () => {
    const scraper = new VoteScraper({}, {})
    let date = '2020-3-21'
    expect(scraper.isValidDate(date)).toBeTruthy()
    date = '2019-03-06'
    expect(scraper.isValidDate(date)).toBeTruthy()
  })

  it('should not accept out of order date formats', () => {
    const scraper = new VoteScraper({}, {})
    let date = '3-2001-21'
    expect(scraper.isValidDate(date)).toBeFalsy()
    date = '1999-23-05'
    expect(scraper.isValidDate(date)).toBeFalsy()
    date = '21-11-1886'
    expect(scraper.isValidDate(date)).toBeFalsy()
  })

  it('should not accept totally incorrect formats', () => {
    const scraper = new VoteScraper({}, {})
    let date = '3--2001-21'
    expect(scraper.isValidDate(date)).toBeFalsy()
    date = '1999-9-23-05'
    expect(scraper.isValidDate(date)).toBeFalsy()
    date = 'he-11-llo'
    expect(scraper.isValidDate(date)).toBeFalsy()
    date = 20011205
    expect(scraper.isValidDate(date)).toBeFalsy()
    date = undefined
    expect(scraper.isValidDate(date)).toBeFalsy()
    date = '20080620'
    expect(scraper.isValidDate(date)).toBeFalsy()
  })

  it('should enforce two correct dates for range', () => {
    const scraper = new VoteScraper({}, {})
    let dr = ['2002-12-03', '2003-05-20']
    expect(scraper.isValidDateRange(dr)).toBeTruthy()
    dr = ['2002-12-03', '2003-05-20', '2006-05-03']
    expect(scraper.isValidDateRange(dr)).toBeFalsy()
    dr = ['2002-12-03']
    expect(scraper.isValidDateRange(dr)).toBeFalsy()
    dr = '2006-05-03'
    expect(scraper.isValidDateRange(dr)).toBeFalsy()
    dr = ['hel', 'lo']
    expect(scraper.isValidDateRange(dr)).toBeFalsy()
  })
})

describe('VoteScraper Queries', () => {
  it('should create a url for all possible matches', () => {
    let scraper = new VoteScraper({ url: 'test.com' }, { '42-1': 1234 })
    expect(scraper.params).toHaveLength(1)
    expect(scraper.params).toEqual(expect.arrayContaining([{
      url: 'test.com',
      params: {
        parlSession: 1234,
        billDocumentTypeId: '',
        decisionResultId: '',
        fromDate: '',
        toDate: '',
        billDocumentId: ''
      }
    }]))

    scraper = new VoteScraper({
      url: 'test.com',
      parliaments: 'all',
      billTypes: [BillType.privateMember, BillType.senateGovernment],
      results: [Result.negatived, Result.agreedTo],
      dateRanges: [['2000-03-22', '2010-10-06']],
      billIds: [1, 2, 3, 4]
    }, { a: 1, b: 2, c: 3 })

    expect(scraper.params).toHaveLength(48)
    expect(scraper.params).toEqual(expect.arrayContaining([{
      url: 'test.com',
      params: {
        parlSession: 3,
        billDocumentTypeId: BillType.senateGovernment,
        decisionResultId: Result.negatived,
        fromDate: '2000-03-22',
        toDate: '2010-10-06',
        billDocumentId: 4
      }
    }]))
  })
})
