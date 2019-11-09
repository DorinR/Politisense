import { Firestore } from '../client/src/Firebase'

exports.userSignup = (req, res) => {
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    postalCode: req.body.postalCode
  }

  const db = new Firestore()
  db.User()
    .insert(user)
    .then(() => {
      res.json({
        success: true
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
}
exports.userLogin = (req, res) => {
  const db = new Firestore()
  console.log(req.body.email)
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  db.User()
    .select('email', '==', user.email)
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      let data = {}
      snapshot.forEach(function(doc) {
        data = doc.data()
      })
      res.json({
        success: true,
        data: data
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
}

exports.getUserByEmail = (req, res) => {
  let userEmail = req.params.userEmail
  const db = new Firestore()
  db.User()
    .select('email', '==', userEmail)
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'user not found',
          success: false
        })
      }
      snapshot.forEach(doc => {
        res.json({
          success: true,
          data: doc.data()
        })
      })
    })
    .catch(err =>
      res.status(404).json({
        message: 'UserController.js',
        success: false
      })
    )
}

exports.updateUser = (req, res) => {
  let documentToChangeId = 0
  const db = new Firestore()

  db.User()
    .select('email', '==', req.body.email)
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('no user with this email found')
      }
      snapshot.forEach(doc => {
        documentToChangeId = doc.id
      })
      return db
        .User()
        .reference.doc(documentToChangeId)
        .update({
          password: req.body.password
        })
    })
    .then(() => {
      res.json({
        success: true
      })
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        message: 'getting userID unsuccessfull'
      })
    })
}
