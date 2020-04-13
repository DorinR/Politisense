const Firestore = require('@firestore').Firestore

exports.getMapSupportData = (req, res) => {
  const db = new Firestore()
  db.MapSupportData()
    .where('type', '==', req.params.type)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: 'Data not found in firestore'
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
