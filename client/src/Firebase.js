const fb = require('firebase')

class _Firebase {
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
    fb.initializeApp(this.config)
    this.db = fb.database()
  }
}

class Reference {
  constructor (reference) {
    this.reference = reference
  }

  select (selection) {
    return new Promise((resolve, reject) => {
      this.reference
        .once('value')
        .then((snapshot) => {
          const result = {}
          if (typeof selection === 'undefined') {
            resolve(snapshot.val())
          }
          snapshot.forEach((child) => {
            const key = child.key
            let desired = true
            Object.keys(selection).forEach((required) => {
              if (!child.hasChild(required) || child.val()[required] !== selection[required]) {
                desired = false
              }
            })
            if (desired) {
              result[key] = child.val()
            }
          })
          resolve(result)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  insert (model) {
    return new Promise((resolve) => {
      this.reference
        .push(model)
        .then(() => {
          resolve(true)
        })
        .catch((e) => {
          resolve(false)
        })
    })
  }
}

class Firebase {
  constructor () {
    this.firebase = new _Firebase()
    this.reference = this.firebase.db.ref
  }

  Bill () {
    return new Reference(this.firebase.db.ref('bills'))
  }

  Politician () {
    return new Reference(this.firebase.db.ref('politicians'))
  }

  User () {
    return new Reference(this.firebase.db.ref('users'))
  }

  VoteRecord () {
    return new Reference(this.firebase.db.ref('vote_records'))
  }

  open () {
    this.firebase.db.goOnline()
  }

  close () {
    this.firebase.db.goOffline()
  }
}

module.exports.Firebase = Firebase
module.exports.Reference = Reference
