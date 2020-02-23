/* eslint-env jest */
const VoteScraper = require('../../../data/scraper/VoteScraper').VoteScraper
const VoteScraperModule = require('../../../data/scraper/VoteScraper')
const BillType = require('../../../data/scraper/VoteScraper').VoteScraperBillType
const Result = require('../../../data/scraper/VoteScraper').VoteScraperResult

describe('VoteScraper Dates', () => {
  it('should accept YYYY-MM-DD date format', () => {
    const scraper = new VoteScraper({}, undefined, {})
    let date = '2020-3-21'
    expect(scraper.isValidDate(date)).toBeTruthy()
    date = '2019-03-06'
    expect(scraper.isValidDate(date)).toBeTruthy()
  })

  it('should not accept out of order date formats', () => {
    const scraper = new VoteScraper({}, undefined, {})
    let date = '3-2001-21'
    expect(scraper.isValidDate(date)).toBeFalsy()
    date = '1999-23-05'
    expect(scraper.isValidDate(date)).toBeFalsy()
    date = '21-11-1886'
    expect(scraper.isValidDate(date)).toBeFalsy()
  })

  it('should not accept totally incorrect formats', () => {
    const scraper = new VoteScraper({}, undefined, {})
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
    const scraper = new VoteScraper({}, undefined, {})
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
    let scraper = new VoteScraper({ url: 'test.com' }, undefined, { '42-1': 1234 })
    expect(scraper.params).toHaveLength(1)
    expect(scraper.params).toEqual(expect.arrayContaining([{
      url: 'test.com',
      parliament: '42-1',
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
    }, undefined, { a: 1, b: 2, c: 3 })

    expect(scraper.params).toHaveLength(48)
    expect(scraper.params).toEqual(expect.arrayContaining([{
      url: 'test.com',
      parliament: 'c',
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

  it('should return nothing if incorrect parameters given', () => {
    const scraper = new VoteScraper({ url: 'test.com', results: ['invalid'] }, undefined, { '42-1': 1234 })
    expect(scraper.params).toHaveLength(0)
  })
})

describe('VoteScraper Parliament Data', () => {
  it('should be able parse out parliaments with its ids', async () => {
    VoteScraperModule.funcs.getVotesPageHtml = jest.fn().mockReturnValue(`
    <ul class="dropdown-menu " aria-labelledby="parlSession">
    <li><a data-value="153" data-input="parlSession" class="dropdown-item" href="#">
        43rd Parliament, 1st Session<br>(December 5, 2019 to present)</a></li>
    <li><a data-value="143" data-input="parlSession" class="dropdown-item   " href="#">
        40th Parliament, 1st Session<br>(November 18, 2008 to December 4, 2008)</a></li>
    <li><a data-value="140" data-input="parlSession" class="dropdown-item   " href="#">
        38th Parliament, 1st Session<br>(October 4, 2004 to November 29, 2005)</a></li>
    </ul>
    `)

    const res = await VoteScraperModule.funcs.getParliamentIDMap()
    expect(res).toEqual({
      '43-1': 153,
      '40-1': 143,
      '38-1': 140
    })
  })

  it('should only populate the parliament map if missing the data', async () => {
    VoteScraperModule.clearParliamentMap()
    VoteScraperModule.funcs.getParliamentIDMap = jest.fn().mockReturnValue({})
    await VoteScraperModule.populateParliamentData()
    await VoteScraperModule.populateParliamentData()
    await VoteScraperModule.populateParliamentData()
    expect(VoteScraperModule.funcs.getParliamentIDMap).toHaveBeenCalledTimes(1)
  })
})
