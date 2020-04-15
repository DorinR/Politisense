const Firestore = require('@firestore').Firestore

exports.getRidingCode = (req, res) => {
  getRiding(req, res)
}

exports.getRidingPopulation = (req, res) => {
  getRiding(req, res)
}

async function getRiding (req, res) {
  const targetRiding = req.params.riding
  return new Firestore()
    .Riding()
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

exports.getRidingByRidingCode = async (req, res) => {
  Promise.all([getAllPoliticians(), getAllRidings()])
    .then(([politicians, ridings]) => {
      if (!politicians.length || !ridings.length) {
        res.status(404).json({
          success: false,
          message: 'Data not found'
        })
      }
      if (politicians.length && ridings.length) {
        res.status(200).json({
          success: true,
          data: [politicians, ridings]
        })
      }
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        message: err
      })
    })
}
async function getAllPoliticians () {
  return new Firestore()
    .Politician()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        return null
      }
      const politicians = []
      snapshot.forEach(doc => {
        politicians.push(doc.data())
      })
      return politicians
    })
    .catch(e => {
      console.error(e)
      return null
    })
}

async function getAllRidings () {
  return new Firestore()
    .Riding()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        return null
      }
      const ridings = []
      snapshot.forEach(doc => {
        ridings.push(doc.data())
      })
      return ridings
    })
    .catch(e => {
      console.error(e)
      return null
    })
}
