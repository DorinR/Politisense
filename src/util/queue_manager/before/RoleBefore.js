const QueueAction = require('../QueueAction').QueueAction
const Job = require('../../Job').AbstractJob
const Firestore = require('@firestore').Firestore
const Actions = require('@action')

const Parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
Object.freeze(Parliaments)

class FormatAction extends Actions.Action {
  async perform (result) {
    return result.selected
  }
}

class RoleBeforeAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
    this.politicians = this.retrievePoliticians(new Firestore(false))
  }

  retrievePoliticians (db) {
    return Parliaments.map(parl => {
      return db.forParliament(parl)
        .Politician()
        .select()
        .then(snapshot => {
          const politicians = []
          snapshot.forEach(doc => {
            politicians.push({
              data: doc.data(),
              id: doc.id
            })
          })
          console.log(`INFO: found ${politicians.length} politicians in parliament ${parl}`)
          return politicians
        })
        .then(politicians => {
          return politicians.map(politician => {
            politician.data.name = politician.data.name ? RoleBeforeAction.formatName(politician.data.name) : 'unknown'
            return politician
          })
        })
        .then(conditioned => {
          return conditioned.filter(politician => {
            return politician.data.name !== 'unknown'
          })
        })
    })
  }

  static formatName (name) {
    name = name.toLowerCase()
    let formatted = name.replace(/\.+/g, '')
    formatted = formatted.replace(/'+/g, '')
    // strips out accents since they are not used as a query param, here at least
    formatted = formatted.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    formatted = formatted.replace(/\s+/g, '-')
    return formatted
  }

  async perform () {
    const params = {
      url: this.manager.params[0].url,
      params: {
        parliament: this.manager.params[0].params.parliament
      }
    }
    const links = await RoleBeforeAction
      .create(params)
      .execute()
    console.log(`INFO: found ${links.length} links for MPs`)
    return this.modifyManagerQueryParams(links)
  }

  static create (params) {
    params.params.parliament = 'all'
    const requestParams = RoleBeforeAction.createRequestParams(params)
    return new Job()
      .addAction(new Actions.FetchAction(requestParams))
      .addAction(new Actions.TextParserAction(false, 'a', (elem, $) => {
        return $(elem).attr('href')
      }))
      .addAction(new Actions.SelectionAction('/Members/en/'))
      .addAction(new FormatAction())
  }

  static createRequestParams (params) {
    return {
      url: params.url,
      params: params.params
    }
  }

  async modifyManagerQueryParams (links) {
    this.politicians = await Promise.all(this.politicians)
    const params = this.manager.params
    const newParams = []
    params.forEach(param => {
      const politicians = this.politicians[Parliaments.indexOf(param.params.parliament)]
      politicians.forEach(politician => {
        newParams.push({
          url: param.url,
          name: politician.data.name,
          id: politician.id,
          group: links,
          params: param.params
        })
      })
    })
    this.manager.params = newParams
    this.manager.queryCount = this.manager.params.length
  }
}

module.exports = {
  RoleBeforeAction: RoleBeforeAction
}
