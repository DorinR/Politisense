const Firestore = require('@firestore').Firestore

exports.getRidingCode = (req, res) => {
  const targetRiding = req.params.riding
  const db = new Firestore()
  db.Riding()
    .where('nameEnglish', '==', targetRiding)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).json({
          success: false,
          message: 'Riding not found'
        })
      }
      snapshot.forEach(doc => {
        res.status(200).json({
          success: true,
          data: doc.data()
        })
      })
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        message: 'Error Fetching Riding Code'
      })
      console.error(err)
    })
}

exports.getRidingPopulation = (req, res) => {
  const targetRiding = req.params.riding
  const db = new Firestore()
  db.Riding()
    .where('nameEnglish', '==', targetRiding)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).json({
          success: false,
          message: 'Riding not found'
        })
      }
      snapshot.forEach(doc => {
        res.status(200).json({
          success: true,
          data: doc.data()
        })
      })
    })
    .catch(err =>
      res.status(400).json({
        success: false,
        message: err
      })
    )
}