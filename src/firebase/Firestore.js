const Reference = require('./Reference').Reference
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
    const collection = this.legacy
      ? 'parties'
      : `${this.parliament}/parties/party`
    return this.createReference(collection)
  }

  LegislativeActivityVote () {
    Firestore.legacyCollectionError(this.legacy)
    return this.createReference(
      `${this.parliament}/legislative_activities/vote`
    )
  }

  LegislativeActivity () {
    Firestore.legacyCollectionError(this.legacy)
    return this.createReference(
      `${this.parliament}/legislative_activities/activity`
    )
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

  MapSupportData () {
    console.warn(
      'WARNING: MapSupportData Controller does not support legacy mode.'
    )
    const collection = 'static/map_support_data/map_support_data'
    return this.createReference(collection)
  }

  Party () {
    return this.createReference('parties')
  }

  createReference (collection) {
    return new Reference(this.reference.collection(collection), collection)
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
          .then(result => {})
          .catch(e => {})
      })
      .catch(e => {})
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
