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
  const politicans = await getAllPoliticiansParl43()
  const ridings = await getAllRidings()

  if (politicans.length && ridings.length) {
    res.status(200).json({
      success: true,
      data: [politicans, ridings]
    })
  }

  async function getAllPoliticiansParl43 () {
    const politicains = []
    const db43 = new Firestore().forParliament(43)

    await db43
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
          politicains.push(doc.data())
        })
      })
      .catch(err => {
        res.status(400).json({
          success: false,
          message: err
        })
      })
    return politicains
  }

  async function getAllRidings () {
    const ridings = []
    const db = new Firestore()
    await db
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
      })
      .catch(err => {
        res.status(400).json({
          success: false,
          message: err
        })
      })
    return ridings
  }
}
