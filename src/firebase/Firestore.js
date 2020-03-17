const Reference = require('./Reference').Reference
const fs = require('firebase')
require('firebase/firestore')
if (!fs.app) {
  fs.initializeApp(this.config)
}

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
    this.config = config
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
    this.legacy = legacy
  }

  forParliament (parliament) {
    this.parliament = parliament
    return this
  }

  Bill () {
    const collection = this.legacy ? 'bills' : `${this.parliament}/bills/bill`
    return this.createReference(collection)
  }

  BillClassification () {
    const collection = this.legacy ? 'bill_classification' : `${this.parliament}/bills/tag`
    return this.createReference(collection)
  }

  FinancialRecord () {
    const collection = this.legacy ? 'financialRecord' : 'financialRecord'
    return this.createReference(collection)
  }

  MinisterDescription () {
    if (this.legacy) {
      throw new Error('ERROR: collection not available as a legacy collection')
    }
    const collection = 'static/minister_descriptions/description'
    return this.createReference(collection)
  }

  PoliticalParty () {
    const collection = this.legacy ? 'parties' : `${this.parliament}/parties/party`
    return this.createReference(collection)
  }

  PoliticalParty () {
    const collection = this.legacy ? 'parties' : `${this.parliament}/parties/party`
    return this.createReference(collection)
  }

  Politician () {
    const collection = this.legacy ? 'politicians' : `${this.parliament}/politicians/politician`
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
    const collection = this.legacy ? 'tf_idf_bill' : `${this.parliament}/bills/raw`
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
    const collection = this.legacy ? 'voteRecord' : `${this.parliament}/vote_records/vote_record`
    return this.createReference(collection)
  }

  createReference (collection) {
    return new Reference(this.reference.collection(collection))
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
