import { Firestore } from '../client/src/Firebase'

exports.getRepresentativeByRiding = (req, res) => {
  const db = new Firestore()
  const riding = req.params.riding
  console.log(
    'API Call 2 - getRepresentativeByRiding was called with the riding: ' +
      req.params.riding
  )
  db.Riding()
    .select('riding', '==', riding)
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'Riding Not Found',
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
}
