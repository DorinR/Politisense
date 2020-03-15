const Action = require('../JobAction').AbstractJobAction
const Firestore = require('@firestore').Firestore
const Model = require('@firestore').Models.Model
const Parameters = require('@parameter')

class UpdateCollectionAction extends Action {
  constructor (params) {
    super()
    const { collection } = params
    this.collection = collection
  }

  async perform (results) {
    return Promise.all(
      results.map(result => {
        let { params, data } = result
        data = UpdateCollectionAction.getData(data)
        const parliament = UpdateCollectionAction.getParliament(params)
        const db = new Firestore()
        db.forParliament(parliament)
        let collection = this.collection
        collection = collection.bind(db)
        UpdateCollectionAction.createNewCollectionReference(db, collection)
        return collection()
          .delete()
          .then(deleted => {
            console.log(`INFO: replacing ${deleted} records in ${collection.name}, for parliament ${parliament}`)
            let first = true
            return Promise.all(
              data.map(datum => {
                const ref = UpdateCollectionAction.createNewCollectionReference(db, collection)
                if (first) {
                  first = !first
                  return ref.add(Model.serialise(datum)).then(result => { return result.id })
                } else {
                  return collection()
                    .insert(datum)
                }
              })
            )
          })
      })
    )
  }

  static getData (data) {
    if (Array.isArray(data[0])) {
      data = data[0]
    }
    return data
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

  static createNewCollectionReference (db, collection) {
    const hierarchy = collection().hierarchy()
    let ref = db.reference.collection(hierarchy[0])
    ref = ref.doc(hierarchy[1])
    ref = ref.collection(hierarchy[2])
    return ref
  }
}

module.exports = {
  UpdateCollectionAction: UpdateCollectionAction
}
