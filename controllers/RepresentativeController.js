import { Firestore } from '../client/src/Firebase'

exports.getRepresentativeByRiding = (req, res) => {
  const db = new Firestore()
  const riding = req.params.riding.toLowerCase()
  db.Politician()
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

exports.getAllRepresentatives = (req, res) => {
  const representativesAccumulator = []
  const db = new Firestore()
  db.Politician()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'No Representatives Found in Database',
          success: false
        })
      }
      snapshot.forEach(doc => {
        representativesAccumulator.push(doc.data())
      })

      if (!representativesAccumulator.empty) {
        res.status(200).json({
          data: representativesAccumulator,
          success: true
        })
      }
    })
    .catch(err => {
      console.error(err)
      res.status(400).json({
        data: representativesAccumulator,
        success: false
      })
      console.log(err)
    })
}
