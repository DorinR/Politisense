import { Firestore } from '../client/src/Firebase'

exports.getAllPartyData = (req, res) => {
  console.log('party: ', req.params.party)
  const db = new Firestore()
  const party = req.params.party
  db.Party()
    .where('name', '==', party)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).json({
          success: false,
          message: 'No party with that name found'
        })
      }
      snapshot.forEach(doc => {
        res.status(200).json({
          success: true,
          data: doc.data()
        })
      })
    })
    .catch(console.error)
}
