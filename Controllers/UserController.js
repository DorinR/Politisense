import { Firestore } from '../client/src/Firebase'
import represent from 'represent'

exports.userLogin = (req, res) => {
  const db = new Firestore()
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  let entry = {}
  db.User().select('email', '==', user.email)
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

exports.setRiding = (req, res) => {
  const postalCode = (req.body.postalCode).replace(/\s/g, '').toUpperCase()
  let riding = ''
  let federalArray = []
  represent.postalCode(postalCode, function (err, data) {
    federalArray = data.boundaries_centroid.filter(entry => entry.boundary_set_name === 'Federal electoral district')
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