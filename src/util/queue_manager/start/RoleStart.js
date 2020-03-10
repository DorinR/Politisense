const QueueActions = require('../actions')
const QueueAction = QueueActions.QueueAction
const Job = require('../../Job').AbstractJob
const RoleFetchJob = require('../../../job/RoleFetchJob').RoleFetchJob
const Firestore = require('@firestore').Firestore
const Actions = require('@action')

class RoleStartAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
    this.first = RoleStartAction.createFirst(manager)
    this.links = []
  }

  async perform () {
    this.links = await this.first.execute()
    console.log(`INFO: found ${this.links.length} links for MPs`)
    await this.modifyManagerQueryParams(this.manager)
    this.enqueueNewParams(this.manager)
  }

  static createFirst (manager) {
    const params = manager.params.shift()
    params.params.parliament = 'all'
    const requestParams = RoleStartAction.createRequestParams(params)
    const cb = manager.requeueCallback.bind(manager)

    return new Job(params.url, cb)
      .addAction(new Actions.FetchAction(requestParams))
      .addAction(new Actions.TextParserAction(false, 'a', (elem, $) => {
        return $(elem).attr('href')
      }))
      .addAction(new Actions.SelectionAction('/Members/en/'))
      .addAction(new FormatAction(params))
  }

  static createRequestParams (params) {
    return {
      url: params.url,
      params: params.params
    }
  }

  async modifyManagerQueryParams (manager) {
    const params = manager.params
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
                name: name ? RoleStartAction.formatName(name) : 'unknown',
                id: doc.id,
                group: this.links,
                params: param.params
              })
            })
          })
      }))
    manager.params = newParams
    manager.queryCount = manager.params.length
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

  enqueueNewParams (manager) {
    manager.params.forEach(param => {
      manager.queue.enqueue(
        RoleFetchJob.create(
          param,
          manager.requeueCallback.bind(manager)
        )
      )
    })
  }
}

class FormatAction extends Actions.Action {
  constructor (params) {
    super()
    this.params = params
  }

  async perform (result) {
    return result.selected
  }
}

module.exports = {
  RoleStartAction: RoleStartAction
}
