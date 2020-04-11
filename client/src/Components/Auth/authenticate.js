const fs = require('firebase')
require('firebase/auth')

export function tokenAuthenticate (token, config) {
  if (fs.apps.length === 0) {
    fs.initializeApp(config)
  }
  return fs.auth().signInWithPopup(token)
}
