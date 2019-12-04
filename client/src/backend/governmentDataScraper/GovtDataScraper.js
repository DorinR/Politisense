import { ScrapeRunner } from '../../scraper/ScrapeRunner'
import { BillXmlParser } from '../xmlDataParser/BillXmlParser'
import { MpXmlParser } from '../xmlDataParser/MpXmlParser'
import { VoteXmlParser } from '../xmlDataParser/VoteXmlParser'
import { LinkScraper } from '../../scraper/job_actions/LinkScraperAction'

const cheerio = require('cheerio')
const Promise = require('bluebird')

class GovtDataScraper {
  async getGovernmentData (scrapeRunnerXmlCount) {
    const runner = new ScrapeRunner(scrapeRunnerXmlCount)
    const xmlList = await runner.getXmlContent()

    const data = {
      bills: [],
      mps: [],
      votes: []
    }

    const currentParliament = await this.getCurrentParliament()

    console.log(`Trying to convert ${xmlList.length} xml files into data`)

    xmlList.forEach(xml => {
      data.bills = this.addUniqueData(data.bills, this.getPossibleDataFromXmlParser(new BillXmlParser(xml, {
        mustHaveRoyalAssent: true,
        mustBeInCurrentParliament: true
      }, currentParliament)), 'id')
      data.mps = this.addUniqueData(data.mps, this.getPossibleDataFromXmlParser(new MpXmlParser(xml, true)), 'name')
      data.votes = this.addUniqueData(data.votes, this.getPossibleDataFromXmlParser(new VoteXmlParser(xml, currentParliament)), 'id')
    })

    const billNumberList = data.bills.map(bill => bill.number)
    await this.cleanUpVotes(data.votes, billNumberList, currentParliament)
    await this.addImageUrlForAllMps(data.mps)

    console.log('Returning Data')
    return data
  }

  getPossibleDataFromXmlParser (xmlParser) {
    let data = []
    if (xmlParser.hasData()) {
      data = data.concat(xmlParser.getAllFromXml(false))
    }
    return data
  }

  addUniqueData (listToAddTo, dataListToAdd, uniqueKey) {
    return listToAddTo.concat(dataListToAdd.filter(dataToAdd => {
      const dataAlreadyExists = listToAddTo.some(existingData => existingData[uniqueKey] === dataToAdd[uniqueKey])
      return !dataAlreadyExists
    }))
  }

  async getCurrentParliament () {
    const url = 'https://www.ourcommons.ca/'
    const htmlWithParliament = await this.getHtmlWithParliament(url)
    if (htmlWithParliament === '') {
      return ''
    }

    const $ = cheerio.load(htmlWithParliament)
    const currentParliamentText = $('span.subtitle', 'div[aria-labelledby="tabbed-widget-members-work-tab"]').text()
    const parliamentTextAsArray = currentParliamentText.split(', ')
    return { number: parseInt(parliamentTextAsArray[0]), session: parseInt(parliamentTextAsArray[1]) }
  }

  async getHtmlWithParliament (link) {
    const linkScraper = new LinkScraper(link)

    return linkScraper.perform()
      .then(res => {
        return res.body
      }).then(html => {
        return html
      }).catch(e => {
        console.error(e.message)
        return ''
      })
  }

  filterVotesBasedOnGatheredBills (votes, billNumberList) {
    return votes.filter(vote => {
      return billNumberList.some(billNumber => vote.billNumber === billNumber)
    })
  }

  removeMultipleBillVotes (votes) {
    const filteredVotes = []
    votes.forEach(vote => {
      const existingVoteIndex = filteredVotes.findIndex(v => v.billNumber === vote.billNumber)
      if (existingVoteIndex >= 0) {
        const existingVote = filteredVotes[existingVoteIndex]
        const mostRecentVote = (vote.id > existingVote.id) ? vote : existingVote
        filteredVotes[existingVoteIndex] = mostRecentVote
      } else {
        filteredVotes.push(vote)
      }
    })
    return filteredVotes
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

  async addVotersForAllVotes (votes, currentParliament) {
    return Promise.map(votes, (vote) => {
      return new Promise((resolve) => {
        new VoteXmlParser('', currentParliament).getVoters(vote.id).then((voters) => {
          vote.voters = voters
          resolve('done')
        })
      })
    }, { concurrency: 20 })
  }

  async cleanUpVotes (votes, billNumberList, currentParliament) {
    votes = this.filterVotesBasedOnGatheredBills(votes, billNumberList)
    votes = this.removeMultipleBillVotes(votes)
    await this.addVotersForAllVotes(votes, currentParliament)
  }

  async addDataToDatabase (dbDoc, dataList) {
    return Promise.map(dataList, (data) => {
      return new Promise((resolve, reject) => {
        dbDoc.insert(data).then(res => {
          resolve(res)
        }).catch(e => {
          reject(e)
        })
      })
    }, { concurrency: 10 })
  }
}

module.exports.GovtDataScraper = GovtDataScraper
