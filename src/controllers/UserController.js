import { Authentication as Auth, Firestore } from '@firestore'
import represent from 'represent'

exports.checkIfUserExists = (req, res) => {
  const email = req.body.email
  const db = new Firestore()
  db.User()
    .where('email', '==', email)
    .select()
    .then(snapshot => {
      if (snapshot.empty || snapshot.size > 1) {
        res.json({
          success: false,
          message: 'doesnt exist',
          data: {}
        })
      } else {
        snapshot.forEach(doc => {
          res.json({
            success: true,
            message: 'user exists',
            data: doc.data()
          })
        })
      }
    })
    .catch(console.error)
}

exports.getUserInterests = (req, res) => {
  const email = req.body.email
  const db = new Firestore()
  db.User()
    .where('email', '==', email)
    .select()
    .then(snapshot => {
      if (snapshot.empty || snapshot.size > 1) {
        res.json({
          success: false,
          data: 'doesnt exist or more than one in db'
        })
      } else {
        snapshot.forEach(doc => {
          res.json({
            success: true,
            data: doc.data()
          })
        })
      }
    })
    .catch(console.error)
}

exports.userSignup = async (req, res) => {
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    postalCode: req.body.postalCode,
    categories: req.body.categories,
    riding: req.body.riding
  }
  if (req.body.password) {
    user.password = Auth.hashPassword(req.body.password)
  }

  const db = new Firestore()
  await db
    .User()
    .where('email', '==', user.email)
    .select()
    .then(async snapshot => {
      if (snapshot.empty) {
        await db
          .User()
          .insert(user)
          .then(() => {
            res.json({
              success: true
            })
          })
          .catch(console.error)
      } else {
        res.json({
          success: false,
          message: 'Please try a different email address'
        })
      }
    })
    .catch(console.error)
}
exports.userLogin = (req, res) => {
  const credentials = {
    email: req.body.email,
    password: req.body.password
  }
  new Auth()
    .authenticate('email')(credentials.email, credentials.password)
    .then((json) => {
      console.log(`${json.success ? 'Successful' : 'Unsuccessful'} login for ${credentials.email} with message: ${json.auth}`)
      res.json(json)
    })
    .catch(console.error)
}

exports.socialLogin = (req, res) => {
  const social = String(req.body.type)
  const token = new Auth().authenticate(social)
  res.json({
    success: true,
    data: {
      token: token,
      config: new Firestore().firestore.config
    }
  })
}

exports.getUserByEmail = (req, res) => {
  const userEmail = req.params.userEmail
  const db = new Firestore()
  db.User()
    .where('email', '==', userEmail)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).json({
          message: 'user not found',
          success: false
        })
      } else {
        snapshot.forEach(doc => {
          res.json({
            success: true,
            data: doc.data()
          })
        })
      }
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
    .where('email', '==', req.body.email)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        throw new Error('no user with this email found')
      }
      snapshot.forEach(doc => {
        documentToChangeId = doc.id
      })
      const passwordToStore = Auth.hashPassword(req.body.password)
      return db
        .User()
        .reference.doc(documentToChangeId)
        .update({
          password: passwordToStore
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
        message: 'getting userID unsuccessful'
      })
      console.error(err)
    })
}

const Utils = require('./util/ActivityVotingUtils')

exports.setRiding = async (req, res) => {
  if (!req.body || !req.body.postalCode) {
    Utils.error(res, 412, 'invalid request body')
  }
  const postalCode = req.body.postalCode.replace(/\s/g, '').toUpperCase()
  const ridingID = await new Promise((resolve, reject) => {
    represent.postalCode(
      postalCode + '/?sets=federal-electoral-districts',
      async (err, data) => {
        if (err) reject(err)
        if (data) resolve(data.boundaries_centroid[0].external_id)
      })
  })
    .catch(e => {
      console.error(e.message)
      return null
    })

  if (!ridingID) {
    Utils.error(res, 200, 'Invalid postal code')
    return
  }

  new Firestore()
    .Riding()
    .where('code', '==', Number(ridingID))
    .select()
    .then(snapshot => {
      if (snapshot.empty || snapshot.size > 1) {
        throw new Error('Too many ridings found')
      }
      let name = ''
      snapshot.forEach(doc => {
        name = doc.data().nameEnglish
        name = name.replace(/--+/g, '-') // double dash is evil
      })
      return name
    })
    .then(name => {
      Utils.success(res, 'Riding Found', name)
    })
    .catch(e => {
      console.error(e)
      Utils.error(res, 500, 'Unspecified Server Error')
    })
}

exports.updateUserRiding = (req, res) => {
  const email = req.body.email
  const riding = req.body.riding
  let targetUserId

  const db = new Firestore()
  db.User()
    .where('email', '==', email)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        throw new Error('No user with this email found')
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

exports.updateUserCategory = (req, res) => {
  const categoryList = req.body.categoryList
  let documentToChangeId = 0
  const db = new Firestore()
  db.User()
    .where('email', '==', req.body.email)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        throw new Error('no user with this email found')
      }
      snapshot.forEach(doc => {
        documentToChangeId = doc.id
      })
      return db
        .User()
        .reference.doc(documentToChangeId)
        .update({
          categories: categoryList
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
