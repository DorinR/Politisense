import { Authentication as Auth, Firestore } from '@firestore'
import represent from 'represent'
import crypto from 'crypto'
const utils = require('./util/ActivityVotingUtils')
const nodemailer = require('nodemailer')

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

exports.deleteAccount = async (req, res) => {
  const user = await utils.retrieveUser(res, req.body.email)
  if (user) {
    new Firestore().User()
      .where('email', '==', req.body.email)
      .delete()
      .then(snapshot => {
        return new Firestore().LegislativeActivityVote()
          .where('user', '==', user.id)
          .delete()
          .then(snapshot => {
            res.json({
              success: true,
              data: 'user was successfully deleted'
            })
          }).catch(err => {
            res.status(500).json({ message: 'server error', success: false })
            console.error(err)
          })
      }).catch(err => {
        res.status(500).json({ message: 'server error', success: false })
        console.error(err)
      })
  } else {
    res.json({
      success: false,
      data: 'user was not found'
    })
  }
}

exports.generateResetLink = (req, res) => {
  const token = crypto.randomBytes(20).toString('hex')
  const email = req.body.email
  new Firestore().User()
    .where('email', '==', email)
    .update({ resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 })
    .then(result => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`
        }
      })
      const mailOptions = {
        from: 'politisense@gmail.com',
        to: email,
        subject: 'Link to Password Reset',
        text:
                  'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
                  `https://politisense.herokuapp.com/reset/${token}\n\n` +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          res.status(400).json({ success: false, message: err })
        } else {
          res.json({
            success: true,
            data: 'email sent'
          })
        }
      })
    }).catch(err => {
      res.status(500).json({ message: 'server error', success: false })
      console.error(err)
    })
}

exports.checkTokenValid = (req, res) => {
  const token = req.body.token
  const db = new Firestore()
  let user = {}
  db.User()
    .where('resetPasswordToken', '==', token)
    .select()
    .then(snapshot => {
      if (snapshot.empty || snapshot.size < 1) {
        res.status(200).json({ success: false, message: 'no token available', data: {} })
      } else {
        snapshot.forEach(doc => {
          user = doc.data()
        })
        if (user.resetPasswordExpires > Date.now()) {
          res.status(200).json({ success: true, data: user })
        } else {
          res.status(200).json({ success: false, message: 'expired token', data: {} })
        }
      }
    }).catch(err => {
      res.status(500).json({ message: 'server error', success: false })
      console.error(err)
    })
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

exports.activateAccount = (req, res) => {
  const token = req.body.token
  new Firestore().User()
    .where('verifyToken', '==', token)
    .update({ verified: 'true' })
    .then(result => {
      res.json({
        success: true,
        data: 'verified'
      })
    }).catch(console.error)
}

exports.generateActivationLink = (req, res) => {
  const email = req.body.email
  let user = {}
  new Firestore().User()
    .where('email', '==', email)
    .select()
    .then(snapshot => {
      snapshot.forEach(doc => {
        user = doc.data()
      })
      const token = user.verifyToken
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`
        }
      })
      const mailOptions = {
        from: 'politisense@gmail.com',
        to: email,
        subject: 'Link to Activate Account',
        text:
                    'Please visit the following link to activate your account.\n\n' +
                    `https://politisense.herokuapp.com/activate/${token}\n\n` +
                    'If you did not request this, please ignore this email.\n'
      }
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          res.status(400).json({ success: false, message: err })
        } else {
          res.json({
            success: true,
            data: 'email sent'
          })
        }
      })
    }
    ).catch(err => {
      res.status(500).json({ message: 'server error', success: false })
      console.error(err)
    })
}

exports.userSignup = async (req, res) => {
  const token = crypto.randomBytes(20).toString('hex')
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    postalCode: req.body.postalCode,
    categories: req.body.categories,
    riding: req.body.riding,
    verifyToken: token,
    verified: false
  }
  if (req.body.type === 'social') {
    user.verified = true
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
            if (req.body.type !== 'social') {
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: `${process.env.EMAIL_ADDRESS}`,
                  pass: `${process.env.EMAIL_PASSWORD}`
                }
              })
              const mailOptions = {
                from: 'politisense@gmail.com',
                to: user.email,
                subject: 'Link to Activate Account',
                text:
                          'Please visit the following link to activate your account.\n\n' +
                          `https://politisense.herokuapp.com/activate/${token}\n\n` +
                          'If you did not request this, please ignore this email.\n'
              }
              transporter.sendMail(mailOptions, (err) => {
                if (err) {
                  res.status(400).json({ success: false, message: err })
                } else {
                  res.json({
                    success: true,
                    data: 'email sent'
                  })
                }
              })
            }

            res.json({
              success: true
            })
          }).catch(err => {
            res.status(500).json({ message: 'server error', success: false })
            console.error(err)
          })
      } else {
        res.json({
          success: false,
          message: 'Please try a different email address'
        })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'server error', success: false })
      console.error(err)
    })
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

exports.checkUserVerified = (req, res) => {
  const email = req.body.email
  let user = {}
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
          user = doc.data()
        })
        if (user.verified) {
          res.json({
            success: true,
            message: 'verified'
          })
        } else {
          res.json({
            success: true,
            message: 'unverfied'
          })
        }
      }
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
