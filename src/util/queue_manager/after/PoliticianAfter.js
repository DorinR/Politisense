const QueueAction = require('../QueueAction').QueueAction
const Actions = require('../../action/actions')
const Job = require('../../Job').AbstractJob

class PoliticianAfterAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
  }

  async perform () {
    console.log('INFO: adding image URLs to Politician Records')
    const imageLinks = await PoliticianAfterAction
      .createFetchJob()
      .execute()
    this.attachToMps(imageLinks)
    console.log('INFO: stripping away unnecessary hyphens from riding names')
    this.stripHyphens()
  }

  static createFetchJob () {
    return new Job()
      .addAction(new Actions.FetchAction({
        url: 'https://www.ourcommons.ca/Members/en/search',
        params: {
          parliament: 'all'
        }
      }))
      .addAction(new Actions.TextParserAction(false, 'img.ce-mip-mp-picture', (elem, $) => {
        return $(elem).attr('src')
      }))
      .addAction(new Actions.SelectionAction('/Content/Parliamentarians/Images/OfficialMPPhotos/'))
      .addAction(new Actions.PoliticianAfterAdapterAction())
  }

  attachToMps (links) {
    this.manager.result.forEach(resp => {
      resp.data.forEach(datum => {
        datum.forEach(entry => {
          entry.imageUrl = this.findUrl(entry, links)
          entry.imageUrl = entry.imageUrl ? entry.imageUrl : 'unavailable'
        })
      })
    })
  }

  findUrl (politician, links) {
    const names = politician.name.split(' ')
    return links.find(elem => {
      return names.every(name => {
        return elem.toLowerCase().includes(name.toLowerCase())
      })
    })
  }

  stripHyphens () {
    this.manager.result.forEach(resp => {
      resp.data.forEach(datum => {
        datum.forEach(entry => {
          this.stripHyphensFromRecord(entry)
        })
      })
    })
  }

  stripHyphensFromRecord (record) {
    let riding = record.riding
    if (riding.includes('\u2014')) {
      riding = riding.replace(/\u2014/g, '-')
    }
    if (riding.includes('--')) {
      riding = riding.replace(/--/gi, '-')
    }
    record.riding = riding
  }
}

module.exports = {
  PoliticianAfterAction: PoliticianAfterAction
}
