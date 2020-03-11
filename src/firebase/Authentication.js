const Firestore = require('./Firestore').Firestore
const bcrypt = require('bcryptjs')

class _Auth {
  constructor () {
    const fs = new Firestore()
    const ref = fs.firebase.auth
    this.auth = fs.firebase.auth()

    this.providers = {}
    this.providers.facebook = new ref.FacebookAuthProvider()
    this.providers.google = new ref.GoogleAuthProvider()
    this.providers.twitter = new ref.TwitterAuthProvider()
    this.providers.microsoft = new ref.OAuthProvider('microsoft.com')
    this.providers.email = this.emailAuthenticate.bind(this)
  }

  authenticate (type) {
    return this.providers[type]
  }

  emailAuthenticate (email, password) {
    return new Promise((resolve, reject) => {
      new Firestore()
        .User()
        .where('email', '==', String(email))
        .select()
        .then(snapshot => {
          if (snapshot.empty || snapshot.size > 1) {
            resolve({
              success: false,
              auth: 'Email entered does not exist or is not unique',
              type: 'email'
            })
          }
          snapshot.forEach(doc => {
            const entry = doc.data()
            if (this.compare(password, entry.password)) {
              resolve({
                success: true,
                auth: 'Successful login',
                type: 'success'
              })
            } else {
              resolve({
                success: false,
                auth: 'Incorrect password',
                type: 'password'
              })
            }
          })
        })
        .catch(reject)
    })
  }

  compare (password, hash) {
    return bcrypt.compareSync(password, hash)
  }
}

class Auth {
  constructor () {
    this.auth = new _Auth()
  }

  authenticate (type) {
    return this.auth.authenticate(type)
  }

  static hashPassword (plaintext) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(plaintext, salt)
    return hash
  }
}

module.exports = {
  Auth: Auth
}
