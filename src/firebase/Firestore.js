const Model = require('./model/models').Model
const fs = require('firebase')
require('firebase/firestore')
if (!fs.app) {
  fs.initializeApp(this.config)
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
    this.googleProvider = new fs.auth.GoogleAuthProvider()
    this.facebookProvider = new fs.auth.FacebookAuthProvider()
    this.twitterProvider = new fs.auth.TwitterAuthProvider()
    this.microsoftProvider = new fs.auth.OAuthProvider('microsoft.com')
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
    return new Promise(resolve => {
      this.reference
        .add(model)
        .then(result => {
          resolve(true)
        })
        .catch(() => {
          resolve(false)
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
        throw new Error(
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
          throw new Error(
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
  constructor (legacy = true) {
    this.firestore = getInstance()
    this.reference = this.firestore.db
    this.googleProvider = this.firestore.googleProvider
    this.firebase = this.firestore.firebase
    this.facebookProvider = this.firestore.facebookProvider
    this.twitterProvider = this.firestore.twitterProvider
    this.microsoftProvider = this.firestore.microsoftProvider
    this.parliament = 43
    this.legacy = legacy
  }

  forParliament (parl) {
    this.parliament = parl
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
    const collection = this.legacy ? 'financialRecord' : `${this.parliament}/financialRecord`
    return this.createReference(collection)
  }

  Politician () {
    const collection = this.legacy ? 'politicians' : `${this.parliament}/politicians/politician`
    return this.createReference(collection)
  }

  Riding () {
    const collection = this.legacy ? 'ridings' : `${this.parliament}/ridings`
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
    const collection = this.legacy ? 'users' : `${this.parliament}/users`
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

  Party () {
    return new Reference(this.reference.collection('parties'))
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
}

module.exports.Firestore = Firestore
module.exports.Reference = Reference
