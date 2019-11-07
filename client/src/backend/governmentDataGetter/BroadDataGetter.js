import { ScrapeRunner } from '../../scraper/ScrapeRunner'
import { BillXmlParser } from '../xmlDataParser/BillXmlParser'
import { MpXmlParser } from '../xmlDataParser/MpXmlParser'
import { VoteXmlParser } from '../xmlDataParser/VoteXmlParser'
import { VoteParticipantsXmlParser } from '../xmlDataParser/VoteParticipantsXmlParser'

class BroadDataGetter {
  async getGovernmentData (scrapeRunnerXmlCount) {
    const runner = new ScrapeRunner(scrapeRunnerXmlCount, 60000, undefined, undefined)
    const promisedXmlList = await runner.getXmlContent()
    const xmlList = await Promise.all(promisedXmlList)

    const data = {
      bills: [],
      mps: [],
      votes: [],
      voteParticipants: {}
    }

    console.log(`Trying to convert ${xmlList.length} xml files into data`)
    for (const xml of xmlList) {
      data.bills = data.bills.concat(this.getPossibleDataFromXmlParser(new BillXmlParser(xml)))
      data.mps = data.mps.concat(this.getPossibleDataFromXmlParser(new MpXmlParser(xml)))
      data.votes = data.votes.concat(this.getPossibleDataFromXmlParser(new VoteXmlParser(xml)))
      // vote participants is always wanted in a group so getting it is a little different
      const voteParticipantParser = new VoteParticipantsXmlParser(xml)
      if (voteParticipantParser.hasListOfData() && voteParticipantParser.hasData()) {
        data.voteParticipants[voteParticipantParser.getVoteId()] = voteParticipantParser.getAllFromXml()
      }
    }

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

  async addImageUrlForAllMps (mpList) {
    const mpImageList = []
    for (const mp of mpList) {
      mpImageList.push(new Promise((resolve) => {
        new MpXmlParser('').getMpImageUrl(mp.name).then((imageUrl) => {
          mp.imageUrl = imageUrl
          resolve('done')
        })
      }))
    }
    return Promise.all(mpImageList)
  }
}

module.exports.BroadDataGetter = BroadDataGetter
