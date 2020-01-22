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
      res.status(400).json({
        data: representativesAccumulator,
        success: false
      })
    })
}

exports.getRepresentativeId = async (req, res) => {
  console.log('getRepresentativeId endpoint hit!')
  console.log('value received:', req.params.representative)
  const db = new Firestore()
  await db
    .Politician()
    .where('name', '==', req.params.representative)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).json({
          success: false,
          message: 'Representative not found'
        })
      }
      snapshot.forEach(doc => {
        res.status(200).json({
          success: true,
          data: doc.id
        })
      })
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        message: err
      })
    })
}
