import { Firestore } from '../client/src/Firebase'
import represent from 'represent'

exports.checkIfUserExists = (req, res) => {
  const email = req.body.email
  const db = new Firestore()
  db.User()
    .select('email', '==', email)
    .then(snapshot => {
      if (snapshot.empty) {
        res.json({
          success: false,
          data: 'doesnt exist'
        })
      } else {
        res.json({
          success: true,
          data: 'its already in db'
        })
      }
    })
    .catch(err => {
      console.error('Error getting documents', err)
    })
}

exports.userSignup = (req, res) => {
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    postalCode: req.body.postalCode,
    categories: {
      category1: req.body.category1,
      category2: req.body.category2
    },
    riding: req.body.riding
  }
  if (req.body.password) {
    user.password = req.body.password
  }
  const db = new Firestore()
  db.User()
    .select('email', '==', user.email)
    .then(snapshot => {
      if (snapshot.empty) {
        db.User()
          .insert(user)
          .then(() => {
            res.json({
              success: true
            })
          })
          .catch(err => {
            console.error('Error getting documents', err)
          })
      } else {
        res.json({
          success: false,
          message: 'Please try a different email address'
        })
      }
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
}
exports.userLogin = (req, res) => {
  const db = new Firestore()
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  let entry = {}
  db.User()
    .select('email', '==', user.email)
    .then(snapshot => {
      if (snapshot.empty) {
        res.json({
          success: false,
          auth: 'Email entered does not exist',
          type: 'email'
        })
      }
      snapshot.forEach(doc => {
        entry = doc.data()
        if (entry.password === user.password) {
          res.json({
            success: true,
            auth: 'Successful login'
          })
        } else {
          res.json({
            success: false,
            auth: 'Incorrect password',
            type: 'password'
          })
        }
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
}

exports.getUserByEmail = (req, res) => {
  const userEmail = req.params.userEmail
  const db = new Firestore()
  db.User()
    .select('email', '==', userEmail)
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).json({
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
    .catch(err => {
      res.status(404).json({
        message: 'UserController.js',
        success: false
      })
      console.error(err)
    })
}

exports.updateUser = (req, res) => {
  let documentToChangeId = 0
  const db = new Firestore()

  db.User()
    .select('email', '==', req.body.email)
    .then(snapshot => {
      if (snapshot.empty) {
        console.error('no user with this email found')
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
      res.status(404).json({
        success: false,
        message: 'getting userID unsuccessfull'
      })
      console.error(err)
    })
}

exports.setRiding = (req, res) => {
  const postalCode = req.body.postalCode.replace(/\s/g, '').toUpperCase()
  let riding = ''
  let federalArray = []
  represent.postalCode(postalCode, function (err, data) {
    if (err) {
      res.json({
        success: false
      })
      return
    }
    federalArray = data.boundaries_centroid.filter(
      entry => entry.boundary_set_name === 'Federal electoral district'
    )
    let maxid = 0
    let maxobj = {}
    for (let i = 0; i < federalArray.length; i++) {
      if (federalArray[i].external_id > maxid) {
        maxid = federalArray[i].external_id
        maxobj = federalArray[i]
      }
    }
    riding = maxobj.name
    res.json({
      success: true,
      data: riding
    })
  })
}

exports.updateUserRiding = (req, res) => {
  const email = req.body.email
  const riding = req.body.riding
  let targetUserId

  const db = new Firestore()
  db.User()
    .select('email', '==', email)
    .then(snapshot => {
      if (snapshot.empty) {
        console.error('No user with this email found')
      }
      snapshot.forEach(doc => {
        targetUserId = doc.id
      })
      return db
        .User()
        .reference.doc(targetUserId)
        .update({
          riding: riding
        })
    })
    .then(() => {
      res.status(200).json({
        success: true
      })
    })
    .catch(err => {
      res.status(404).json({
        success: false,
        message: 'Error updating user riding'
      })
      console.error(err)
    })
}
