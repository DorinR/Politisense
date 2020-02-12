const Firebase = require('../../firebase/firebase')
const Auth = Firebase.Authentication
const Firestore = Firebase.Firestore

const firebase = require('firebase')

const chai = require('chai')
const Assert = chai.assert

/* eslint-env jest */
describe('Authentication.js', () => {
  let underTest
  let user

  function assertProperResponse (json) {
    Assert.equal(typeof json, typeof {})
    Assert.notEqual(json.success, null)
    Assert.notEqual(json.auth, null)
    Assert.notEqual(json.type, null)

    Assert.equal(typeof json.success, typeof true)
    Assert.equal(typeof json.auth, typeof ' ')
    Assert.equal(typeof json.type, typeof ' ')
  }

  beforeEach(async () => {
    underTest = new Auth()
    user = await new Firestore()
      .User()
      .where('email', '==', 'w@w.com')
      .select()
      .then(snapshot => {
        let u = null
        snapshot.forEach(doc => {
          u = doc.data()
        })
        u.password = 'Mw7DvQ52'
        return u
      })
  })

  test('Authentication.js::Auth::authenticate returns true for valid email and password', async (done) => {
    const json = await underTest.authenticate('email')(user.email, user.password)
    assertProperResponse(json)
    Assert.equal(json.success, true)
    Assert.equal(json.auth, 'Successful login')
    Assert.equal(json.type, 'success')
    done()
  }, 6000)

  test('Authentication.js::Auth::authenticate returns false for invalid email and password', async (done) => {
    user.password = ' '
    const json = await underTest.authenticate('email')(user.email, user.password)
    assertProperResponse(json)
    Assert.equal(json.success, false)
    Assert.equal(json.auth, 'Incorrect password')
    Assert.equal(json.type, 'password')
    done()
  }, 6000)

  test('Authentication.js::Auth::authenticate returns correct tokens for social logins', async (done) => {
    let token = await underTest.authenticate('google')
    Assert.isTrue(token instanceof firebase.auth.GoogleAuthProvider)
    token = await underTest.authenticate('twitter')
    Assert.isTrue(token instanceof firebase.auth.TwitterAuthProvider)
    token = await underTest.authenticate('facebook')
    Assert.isTrue(token instanceof firebase.auth.FacebookAuthProvider)
    token = await underTest.authenticate('microsoft')
    Assert.isTrue(token instanceof firebase.auth.OAuthProvider)
    done()
  }, 6000)

  test('Authentication.js::Auth::hashPassword correctly hashes cleartext', async (done) => {
    const clearText = 'this is a password'
    const cipherText = Auth.hashPassword(clearText)
    const result = new Auth().auth.compare(clearText, cipherText)
    Assert.isTrue(result)
    done()
  }, 6000)
})
