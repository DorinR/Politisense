import { Firestore } from './Firebase'

const bcrypt = require('bcryptjs')

class _Auth {
  constructor () {
    const fs = new Firestore()
    const ref = fs.firebase.auth
    this.auth = fs.firebase.auth()

    this.providers = {}
    this.providers['facebook'] = new ref.FacebookAuthProvider()
    this.providers['google'] =  new ref.GoogleAuthProvider()
    this.providers['twitter'] = new ref.TwitterAuthProvider()
    this.providers['microsoft'] = new ref.OAuthProvider('microsoft.com')
    this.providers['email'] = this.emailAuthenticate.bind(this)
  }

  authenticate(type) {
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
            console.log(snapshot.size)
            resolve({
              success: false,
              auth: 'Email entered does not exist or is not unique',
              type: 'email'
            })
          }
          snapshot.forEach(doc => {
            const entry = doc.data()
            if (bcrypt.compareSync(password, entry.password)) {
              resolve({
                success: true,
                auth: 'Successful login'
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
}

class Auth {
  constructor () {
    this.auth = new _Auth()
  }

  authenticate (type) {
    return this.auth.authenticate(type)
  }

  static hashPassword(plaintext) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(plaintext, salt)
    return hash
  }
}

function tokenAuthenticate(token) {
  return new _Auth().auth.signInWithPopup(token)
}

export { Auth, tokenAuthenticate }