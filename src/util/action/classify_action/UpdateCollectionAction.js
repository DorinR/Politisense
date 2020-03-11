const Action = require('../JobAction').AbstractJobAction
const Firestore = require('@firestore').Firestore
const Parameters = require('@parameter')

class UpdateCollectionAction extends Action {
  constructor (params) {
    super()
    const { collection } = params
    this.collection = collection
  }

  perform (results) {
    return results.map(result => {
      let { params, data } = result
      if (Array.isArray(data[0])) {
        data = data[0]
      }
      const parliament = UpdateCollectionAction.getParliament(params)

      const db = new Firestore().forParliament(parliament)
      this.collection.bind(db)

      return Promise.all(
        data.map(record => {
          return true
        })
      )
    })
  }

  static getParliament (params) {
    let parliament
    if (params.parliament) {
      parliament = params.parliament
    } else if (params.ParliamentSession) {
      parliament = Number(params.ParliamentSession.substring(0, 2))
    } else if (params.params.parlSession) {
      parliament = Parameters.VoteParameters.ParliamentfromParlSession[Number(params.params.parlSession)]
    } else if (params.params.parliament) {
      parliament = params.params.parliament
    }
    return parliament
  }
}

module.exports = {
  UpdateCollectionAction: UpdateCollectionAction
}
