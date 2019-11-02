import { Firestore } from '../client/src/Firebase'

exports.getVotesByRepresentative = (req, res) => {
  const representative = req.body.representative
  const db = new Firestore()
  db.VoteRecord()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'Voting Record Not Found',
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
