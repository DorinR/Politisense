const QueueAction = require('../QueueAction').QueueAction
const Job = require('../../Job').AbstractJob
const Firestore = require('@firestore').Firestore
const Actions = require('@action')

class FormatAction extends Actions.Action {
  async perform (result) {
    return result.selected
  }
}

class RoleBeforeAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
    this.links = []
  }

  async perform () {
    this.links = await this.create().execute()
    console.log(`INFO: found ${this.links.length} links for MPs`)
    await this.modifyManagerQueryParams()
  }

  create () {
    const params = Object.assign(this.manager.params[0])
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

  async modifyManagerQueryParams () {
    const params = this.manager.params
    const newParams = []
    const db = new Firestore(false)
    await Promise.all(
      params.map(param => {
        db.forParliament(param.params.parliament)
        return db
          .Politician()
          .select()
          .then(snapshot => {
            snapshot.forEach(doc => {
              const name = doc.data().name
              newParams.push({
                url: param.url,
                name: name ? RoleBeforeAction.formatName(name) : 'unknown',
                id: doc.id,
                group: this.links,
                params: param.params
              })
            })
          })
      }))
    this.manager.params = newParams
    this.manager.queryCount = this.manager.params.length
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
}

module.exports = {
  RoleBeforeAction: RoleBeforeAction
}