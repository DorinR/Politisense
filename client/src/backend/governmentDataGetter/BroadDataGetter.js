import { ScrapeRunner } from '../../scraper/ScrapeRunner'
import { BillXmlParser } from '../xmlDataParser/BillXmlParser'
import { MpXmlParser } from '../xmlDataParser/MpXmlParser'
import { VoteXmlParser } from '../xmlDataParser/VoteXmlParser'
import { VoteParticipantsXmlParser } from '../xmlDataParser/VoteParticipantsXmlParser'
import { LinkScraper } from '../../scraper/job_actions/LinkScraperAction'

const cheerio = require('cheerio')
const Promise = require('bluebird')

class BroadDataGetter {
  async getGovernmentData (scrapeRunnerXmlCount) {
    const runner = new ScrapeRunner(scrapeRunnerXmlCount, undefined, undefined, undefined)
    const xmlList = await runner.getXmlContent()

    const data = {
      bills: [],
      mps: [],
      votes: [],
      voteParticipants: {}
    }

    const currentParliament = await this.getCurrentParliament()

    console.log(`Trying to convert ${xmlList.length} xml files into data`)
    // eslint-disable-next-line no-unused-vars
    for (const xml of xmlList) {
      data.bills = this.addUniqueData(data.bills, this.getPossibleDataFromXmlParser(new BillXmlParser(xml, {
        mustHaveRoyalAssent: true,
        mustBeInCurrentParliament: true
      }, currentParliament)), 'id')
      data.mps = this.addUniqueData(data.mps, this.getPossibleDataFromXmlParser(new MpXmlParser(xml, true)), 'name')
      data.votes = this.addUniqueData(data.votes, this.getPossibleDataFromXmlParser(new VoteXmlParser(xml, currentParliament)), 'id')
      // vote participants is always wanted in a group so getting it is a little different
      const voteParticipantParser = new VoteParticipantsXmlParser(xml)
      if (voteParticipantParser.hasListOfData() && voteParticipantParser.hasData()) {
        data.voteParticipants[voteParticipantParser.getVoteId()] = voteParticipantParser.getAllFromXml()
      }
    }

    // data post-processing
    const billNumberList = data.bills.map(bill => bill.number)
    data.votes = this.filterVotesBasedOnGatheredBills(data.votes, billNumberList)

    await this.addImageUrlForAllMps(data.mps)

    console.log('Returning Data')
    return data
  }

  getPossibleDataFromXmlParser (xmlParser) {
    let data = []
    if (xmlParser.hasListOfData()) {
      data = data.concat(xmlParser.getAllFromXml())
    } else if (xmlParser.hasData()) {
      // can return null if there is an unwanted aspect of to the data, such as a non active bill
      const dataToPush = xmlParser.xmlToJson()
      if (dataToPush !== null) data.push(dataToPush)
    }
    return data
  }

  /**
   * Only adds objects to list when a certain object key that must be unique to the list is not being added
   * @param {[]} listToAddTo
   * @param {[]} dataListToAdd
   * @param {string} uniqueKey
   * @return {[]}
   */
  addUniqueData (listToAddTo, dataListToAdd, uniqueKey) {
    return listToAddTo.concat(dataListToAdd.filter(dataToAdd => {
      const dataAlreadyExists = listToAddTo.some(existingData => existingData[uniqueKey] === dataToAdd[uniqueKey])
      return !dataAlreadyExists
    }))
  }

  async getCurrentParliament () {
    const url = 'https://www.ourcommons.ca/'
    const linkScraper = new LinkScraper(url)

    let html = ''
    try {
      const res = await linkScraper.perform()
      html = await res.body
    } catch (e) {
      console.log(e.message)
      return ''
    }

    const $ = cheerio.load(html)
    const currentParliamentText = $('span.subtitle', 'div[aria-labelledby="tabbed-widget-members-work-tab"]').text()
    const parliamentTextAsArray = currentParliamentText.split(', ')
    return { number: parseInt(parliamentTextAsArray[0]), session: parseInt(parliamentTextAsArray[1]) }
  }

  filterVotesBasedOnGatheredBills (votes, billNumberList) {
    return votes.filter(vote => {
      return billNumberList.some(billNumber => vote.billNumber === billNumber)
    })
  }

  async addImageUrlForAllMps (mpList) {
    return Promise.map(mpList, (mp) => {
      return new Promise((resolve) => {
        new MpXmlParser('').getMpImageUrl(mp.name).then((imageUrl) => {
          mp.imageUrl = imageUrl
          resolve('done')
        })
      })
    }, { concurrency: 20 })
  }
}

module.exports.BroadDataGetter = BroadDataGetter
