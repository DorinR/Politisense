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

exports.getRidingByRidingCode = async (req, res) => {
  Promise.all([getAllPoliticiansParl43(), getAllRidings()])
    .then(result => {
      if (!result[0].length || !result[1].length) {
        res.status(404).json({
          success: false,
          message: 'Data not found'
        })
      }
      if (result[0].length && result[1].length) {
        res.status(200).json({
          success: true,
          data: result
        })
      }
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        message: err
      })
    })

  async function getAllPoliticiansParl43 () {
    const politicians = []

    return new Firestore()
      .Politician()
      .select()
      .then(snapshot => {
        if (snapshot.empty) {
          res.status(404).json({
            success: false,
            message: 'No politicians found'
          })
          return []
        }
        snapshot.forEach(doc => {
          politicians.push(doc.data())
        })
        return politicians
      })
      .catch(err => {
        res.status(400).json({
          success: false,
          message: err
        })
      })
  }

  async function getAllRidings () {
    const ridings = []

    return new Firestore()
      .Riding()
      .select()
      .then(snapshot => {
        if (snapshot.empty) {
          res.status(404).json({
            success: false,
            message: 'No ridings found'
          })
          return []
        }
        snapshot.forEach(doc => {
          ridings.push(doc.data())
        })
        return ridings
      })
      .catch(err => {
        res.status(400).json({
          success: false,
          message: err
        })
      })
  }
}
