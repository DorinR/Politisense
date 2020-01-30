const ScrapeRunner = require('../../scraper/ScrapeRunner').ScrapeRunner
const BillXmlParser = require('../xmlDataParser/BillXmlParser').BillXmlParser
const MpXmlParser = require('../xmlDataParser/MpXmlParser').MpXmlParser
const VoteXmlParser = require('../xmlDataParser/VoteXmlParser').VoteXmlParser
const LinkScraper = require('../../scraper/job_actions/LinkScraperAction').LinkScraper
const Firestore = require('../../Firebase').Firestore
const Vote = require('../../models/Vote').Vote

const cheerio = require('cheerio')
const Promise = require('bluebird')

class GovtDataScraper {
  async getGovernmentData (scrapeRunnerXmlCount, requestWait, startingUrl, limitedDomains) {
    const runner = new ScrapeRunner(scrapeRunnerXmlCount, requestWait, startingUrl, limitedDomains)
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

  async createVotes () {
    const db = new Firestore()
    const mps = {}
    await db.Politician()
      .select()
      .then(documents => {
        documents.forEach(doc => {
          mps[doc.data().name] = doc.id
        })
      })

    const votes = []
    await db.VoteRecord()
      .select()
      .then(documents => {
        documents.forEach(doc => {
          const id = doc.id
          const voters = doc.data().voters
          Object.keys(voters).forEach((name) => {
            const voter = voters[name]
            try {
              votes.push(new Vote(mps[name], id, voter.vote === 'Yea', voter.paired))
            } catch (e) {
              console.warn(`Member of parliament, ${name}, in vote not found in records.`)
            }
          })
        })
      })
    votes.forEach((v) => {
      db.Vote()
        .insert(v)
    })
  }

  async modifyVoteRecords () {
    const bills = {}
    const db = new Firestore()

    await db.Bill()
      .select()
      .then(documents => {
        documents.forEach(doc => {
          bills[doc.data().number.toString()] = doc.id
        })
      })

    await db.VoteRecord()
      .select()
      .then(documents => {
        const docs = []
        documents.forEach(doc => {
          docs.push(doc)
        })
        return docs
      })
      .then(async docs => {
        await Promise.all(
          docs.map(doc => {
            const data = doc.data()
            if (Object.keys(bills).includes(data.billNumber)) {
              doc.ref.update(
                {
                  bill: bills[data.billNumber],
                  voters: null
                })
            } else {
              doc.ref.update(
                {
                  bill: '',
                  voters: null
                })
            }
          })
        )
      })
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

  standardiseRidingHyphens () {
    return Promise.all([
      this.updatePoliticianHyphens(),
      this.updateRidingHyphens()
    ])
  }

  updatePoliticianHyphens () {
    // EM DASH and double hyphens are satan
    return new Firestore()
      .Politician()
      .select()
      .then(snapshot => {
        const promises = []
        snapshot.forEach(mp => {
          const riding = mp.data().riding
          if (riding.includes('\u2014')) {
            promises.push(mp.ref.update({
              riding: riding.replace('\u2014', '-')
            }))
          } else if (riding.includes('--')) {
            promises.push(mp.ref.update({
              riding: riding.replace(/--/gi, '-')
            }))
          }
        })
        console.log(`updating ${promises.length} politician ridings`)
        return promises
      })
      .then(promises => {
        Promise.all(promises)
      })
      .catch(console.error)
  }

  updateRidingHyphens () {
    return new Firestore()
      .Riding()
      .select()
      .then(snapshot => {
        const promises = []
        snapshot.forEach(rd => {
          let english = rd.data().nameEnglish
          let french = rd.data().nameFrench
          if (english.includes('\u2014')) {
            promises.push(rd.ref.update({
              nameEnglish: english.replace(/\u2014/g, '-')
            }))
          } else if (english.includes('--')) {
            english = english.replace(/--/gi, '-')
            promises.push(rd.ref.update({
              nameEnglish: english
            }))
          }
          if (french.includes('\u2014')) {
            promises.push(rd.ref.update({
              nameFrench: french.replace(/\u2014/g, '-')
            }))
          } else if (french.includes('--')) {
            french = french.replace(/--/gi, '-')
            promises.push(rd.ref.update({
              nameFrench: french
            }))
          }
        })
        console.log(`updating ${promises.length} riding name entries`)
        return promises
      })
      .then(promises => {
        Promise.all(promises)
      })
      .catch(console.error)
  }
}

module.exports.GovtDataScraper = GovtDataScraper
