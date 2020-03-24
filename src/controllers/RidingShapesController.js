const Firestore = require('@firestore').Firestore

exports.getRidingShapes = (req, res) => {
  const db = new Firestore()
  db.RidingShape()
    .where('version', '==', parseInt(req.params.version))
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: 'Riding Shaped for that version not found'
        })
      } else {
        snapshot.forEach(doc => {
          res.status(200).json({
            success: true,
            data: JSON.parse(doc.data().data)
          })
        })
      }
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        message: err
      })
      console.error(err)
    })
}
