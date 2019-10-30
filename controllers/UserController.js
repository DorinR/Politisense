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
    .then(
      () => {
        res.json({
          success: true
        })
      }
    )
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
      snapshot.forEach(function (doc) {
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
//   db.User()
//     .select('email', '==', user.email)
//     .then(
//       () => {
//         res.json({
//           success: true
//         })
//       })
//     .catch(err => {
//       console.log('Error getting documents', err)
//     })
// }
