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
    if (results.length === 0) {
      return []
    }
    UpdateCollectionAction.removeDuplicates(results)
    return Promise.all(
      results.map(async result => {
        let { params, data } = result
        data = UpdateCollectionAction.getData(data)
        const parliament = UpdateCollectionAction.getParliament(params)
        const db = new Firestore()
          .forParliament(parliament)
        if (params && params.year) {
          db.atYear(params.year)
        }
        let collection = this.collection
        collection = collection.bind(db)
        UpdateCollectionAction.createNewCollectionReference(db, collection)
        return UpdateCollectionAction.sanitiseCollection(parliament, collection)
          .then((deleted) => {
            console.log(`INFO: removed ${deleted} records in ${this.collection.name}, for parliament ${parliament}`)
            return this.addData(db, collection, data)
          })
      })
    )
  }

  static sanitiseCollection (parliament, collection) {
    return collection()
      .delete()
  }

  static removeDuplicates (results) {
    let i = 0
    while (i < results.length) {
      const { params, data } = results[i]
      let j = 0
      while (j < results.length) {
        if (i === j) {
          j++
          continue
        }
        if (UpdateCollectionAction.getParliament(params) === UpdateCollectionAction.getParliament(results[j].params)) {
          data.push(...results[j].data)
          results.splice(j, 1)
        } else {
          j++
        }
      }
      i++
    }
  }

  addData (db, collection, data) {
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
    ).then(results => {
      console.log(`INFO: added ${results.length} records in ${this.collection.name}, for parliament ${db.parliament}`)
      return results
    })
  }

  static getData (data) {
    if (Array.isArray(data[0])) {
      data = data.flat()
    }
    return data
  }

  static getParliament (params) {
    let parliament
    if (params.parliament) {
      parliament = params.parliament
    } else if (params.ParliamentSession) {
      parliament = Number(params.ParliamentSession.substring(0, 2))
    } else if (params.params && params.params.parlSession) {
      parliament = Parameters.VoteParameters.ParliamentfromParlSession[Number(params.params.parlSession)]
    } else if (params.params && params.params.parliament) {
      parliament = params.params.parliament
    }
    return parliament
  }

  static createNewCollectionReference (db, collection) {
    const hierarchy = collection().hierarchy()
    let ref = db.reference.collection(hierarchy[0])
    ref = ref.doc(hierarchy[1])
    ref = ref.collection(hierarchy[2])
    if (hierarchy.includes('expenditure')) {
      ref = ref.doc(hierarchy[3])
      ref = ref.collection(hierarchy[4])
    }
    return ref
  }
}

module.exports = {
  UpdateCollectionAction: UpdateCollectionAction
}
