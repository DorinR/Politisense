const Model = require('./model/models').Model
const fs = require('firebase')
require('firebase/firestore')

var config = {
  apiKey: 'AIzaSyBdCSbXtHoTPO4JfPDicPhnams3q1p_6AQ',
  authDomain: 'abdulla-2c3a5.firebaseapp.com',
  databaseURL: 'https://abdulla-2c3a5.firebaseio.com',
  projectId: 'abdulla-2c3a5',
  storageBucket: 'abdulla-2c3a5.appspot.com',
  messagingSenderId: '1084760992823',
  appId: '1:1084760992823:web:c6402249f92d54372ce3b2'
}
Object.freeze(config)

if (!fs.app) {
  fs.initializeApp(config)
}

class _Firestore {
  constructor () {
    this.config = {
      apiKey: 'AIzaSyBdCSbXtHoTPO4JfPDicPhnams3q1p_6AQ',
      authDomain: 'abdulla-2c3a5.firebaseapp.com',
      databaseURL: 'https://abdulla-2c3a5.firebaseio.com',
      projectId: 'abdulla-2c3a5',
      storageBucket: 'abdulla-2c3a5.appspot.com',
      messagingSenderId: '1084760992823',
      appId: '1:1084760992823:web:c6402249f92d54372ce3b2'
    }
    if (!this.app || !fs.app) {
      this.app = fs.initializeApp(this.config)
    } else {
      this.app = fs.app
    }
    this.db = fs.firestore()
    this.firebase = fs
  }
}

var instance = null
function getInstance () {
  if (!instance) {
    instance = new _Firestore()
  }
  return instance
}

class Reference {
  constructor (reference) {
    this.reference = reference
    this.modelsOnly = false
    this.query = null
  }

  where (attribute, operator, value) {
    if (!this.query) {
      this.query = this.reference.where(attribute, operator, value)
    }
    this.query = this.query.where(attribute, operator, value)
    return this
  }

  update (model) {
    if (this.modelsOnly && !(model instanceof Model)) {
      throw new Error('Error: Only a model can be updated in firebase')
    } else if (!this.modelsOnly && !(model instanceof Model)) {
      console.warn(
        'WARNING: Using non models for firestore is deprecated. Use Models instead.'
      )
    }
    if (model instanceof Model) {
      model = Model.serialise(model)
    }
    let ref = this.reference
    if (this.query) {
      ref = this.query
    }
    return new Promise((resolve, reject) => {
      ref
        .get()
        .then(snapshot => {
          const promises = []
          snapshot.forEach(doc => {
            promises.push(doc.ref.update(model))
          })
          return Promise.all(promises)
        })
        .then(() => {
          resolve(true)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  delete () {
    let ref = this.reference
    if (this.query) {
      ref = this.query
    }
    return new Promise((resolve, reject) => {
      ref
        .get()
        .then(async snapshot => {
          let count = 0
          const snapshotArray = []
          snapshot.forEach(doc => {
            snapshotArray.push(doc.ref)
          })
          await Promise.all(
            snapshotArray.map(ref => {
              return ref.delete().then(resp => {
                count++
              })
            })
          )
          resolve(count)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  select (attribute, operator, value) {
    let ref = this.reference.get.bind(this.reference)
    if (
      typeof attribute !== 'undefined' &&
      typeof operator !== 'undefined' &&
      typeof value !== 'undefined' &&
      this.query === null
    ) {
      console.warn(
        'WARNING: using select with parameters is a deprecated behaviour. Use where(..).select() instead.'
      )
      const query = this.reference.where(attribute, operator, value)
      ref = query.get.bind(query)
    } else if (this.query !== null) {
      ref = this.query.get.bind(this.query)
    }
    return new Promise((resolve, reject) => {
      ref()
        .then(snapshot => {
          resolve(snapshot)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  insert (model) {
    if (this.modelsOnly && typeof !(model instanceof Model)) {
      throw new Error('Error: Only a model can be inserted in firebase')
    } else if (!this.modelsOnly && !(model instanceof Model)) {
      console.warn(
        'WARNING: Using non models for firestore is deprecated. Use Models instead.'
      )
    }
    if (model instanceof Model) {
      model = Model.serialise(model)
    }
    return new Promise((resolve, reject) => {
      this.reference
        .add(model)
        .then(result => {
          resolve(result.id)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  async innerJoin (key, reference, refKey) {
    const left = {}
    const right = {}

    const fetch = (snapshot, container, suffix) => {
      snapshot.forEach(doc => {
        const data = doc.data()
        data[`_id${suffix}`] = doc.id
        container[doc.id] = data
      })
    }

    await this.select().then(snapshot => {
      fetch(snapshot, left, `_${this.reference.id}`)
    })
    await reference.select().then(snapshot => {
      fetch(snapshot, right, `_${reference.reference.id}`)
    })

    if (key === '_id') {
      key = `${key}_${this.reference.id}`
    }
    if (refKey === '_id') {
      refKey = `${refKey}_${reference.reference.id}`
    }

    const join = []

    Object.keys(left).forEach(leftKey => {
      const leftDoc = left[leftKey]
      const leftKeys = Object.keys(leftDoc)
      if (!leftKeys.includes(key) && key !== `_id_${this.reference.id}`) {
        console.warn(
          `Current collection: ${this.reference.id} does not contain items with key: ${key} `
        )
      }
      Object.keys(right).forEach(rightKey => {
        const rightDoc = right[rightKey]
        const rightKeys = Object.keys(rightDoc)
        if (
          !rightKeys.includes(refKey) &&
          refKey !== `_id_${reference.reference.id}`
        ) {
          console.warn(
            `Current collection: ${reference.reference.id} does not contain items with key: ${refKey} `
          )
        }
        if (leftDoc[key] === rightDoc[refKey]) {
          const joined = {}
          leftKeys.forEach(k => {
            joined[k] = leftDoc[k]
          })
          rightKeys.forEach(k => {
            joined[k] = rightDoc[k]
          })
          join.push(joined)
        }
      })
    })
    return join
  }
}

class Firestore {
  constructor (legacy = false) {
    this.firestore = getInstance()
    this.reference = this.firestore.db
    this.firebase = this.firestore.firebase
    this.parliament = 43
    this.year = 2019
    this.legacy = legacy
  }

  forParliament (parliament) {
    this.parliament = parliament
    return this
  }

  atYear (year) {
    this.year = year
    return this
  }

  AverageExpenditure () {
    Firestore.legacyCollectionError(this.legacy)
    const collection = `${this.parliament}/politicians/expenditure/${this.year}/averages`
    return this.createReference(collection)
  }

  Bill () {
    const collection = this.legacy ? 'bills' : `${this.parliament}/bills/bill`
    return this.createReference(collection)
  }

  BillClassification () {
    const collection = this.legacy
      ? 'bill_classification'
      : `${this.parliament}/bills/tag`
    return this.createReference(collection)
  }

  FinancialRecord () {
    const collection = this.legacy
      ? 'financialRecord'
      : `${this.parliament}/politicians/expenditure/${this.year}/expenditures`
    return this.createReference(collection)
  }

  MinisterDescription () {
    Firestore.legacyCollectionError(this.legacy)
    const collection = 'static/minister_descriptions/description'
    return this.createReference(collection)
  }

  PoliticalParty () {
    const collection = this.legacy ? 'parties' : `${this.parliament}/parties/party`
    return this.createReference(collection)
  }

  LegislativeActivityVote () {
    Firestore.legacyCollectionError(this.legacy)
    return this.createReference(`${this.parliament}/legislative_activities/vote`)
  }

  LegislativeActivity () {
    Firestore.legacyCollectionError(this.legacy)
    return this.createReference(`${this.parliament}/legislative_activities/activity`)
  }

  Politician () {
    const collection = this.legacy
      ? 'politicians'
      : `${this.parliament}/politicians/politician`
    return this.createReference(collection)
  }

  Riding () {
    const collection = this.legacy ? 'ridings' : 'static/ridings/riding'
    return this.createReference(collection)
  }

  Role () {
    const collection = this.legacy ? 'roles' : `${this.parliament}/roles/role`
    return this.createReference(collection)
  }

  TfIdfClassification () {
    const collection = this.legacy
      ? 'tf_idf_bill'
      : `${this.parliament}/bills/raw`
    return this.createReference(collection)
  }

  User () {
    const collection = this.legacy ? 'users' : 'static/users/user'
    return this.createReference(collection)
  }

  Vote () {
    const collection = this.legacy ? 'votes' : `${this.parliament}/voters/voter`
    return this.createReference(collection)
  }

  VoteRecord () {
    const collection = this.legacy
      ? 'voteRecord'
      : `${this.parliament}/vote_records/vote_record`
    return this.createReference(collection)
  }

  Party () {
    return this.createReference('parties')
  }

  createReference (collection) {
    return new Reference(this.reference.collection(collection))
  }

  static legacyCollectionError (legacy) {
    if (legacy) {
      throw new Error('ERROR: collection not available in legacy mode')
    }
  }

  async close () {
    await this.firestore.app
      .delete()
      .then(result => {
        this.firestore.db
          .terminate()
          .then(result => { })
          .catch(e => { })
      })
      .catch(e => { })
  }

  static copyCollection (from, to) {
    return new Promise(resolve => {
      from
        .select()
        .then(snapshot => {
          const records = []
          snapshot.forEach(doc => {
            records.push(doc.data())
          })
          return records
        })
        .then(records => {
          return records.map(old => {
            return to.insert(old)
          })
        })
        .then(promises => {
          return Promise.all(promises)
        })
        .then(responses => {
          resolve(responses)
        })
        .catch(console.error)
    })
  }
}

module.exports.Firestore = Firestore
module.exports.Reference = Reference
