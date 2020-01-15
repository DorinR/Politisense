import { Firestore } from '../client/src/Firebase'

exports.getRidingCode = (req, res) => {
  const targetRiding = req.params.riding.replace(/—/g, '--')

  const db = new Firestore()
  db.Ridings()
    .select('nameEnglish', '==', targetRiding)
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
