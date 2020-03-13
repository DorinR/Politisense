const Firestore = require('@firestore').Firestore

exports.getImageData = async (req, res) => {
  const name = req.params.name.toLowerCase()
  new Firestore()
    .Politician()
    .where('name', '==', name)
    .select()
    .then(snapshot => {
      if (snapshot.empty || snapshot.size > 1) {
        res.status(400).json({
          message: `Could not find: ${name}`,
          success: false,
          data: {}
        })
      } else {
        snapshot.forEach(doc => {
          res.status(200).json({
            message: `Found Politician: ${name}`,
            success: true,
            data: doc.data()
          })
        })
      }
    })
    .catch(console.error)
}

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
    .catch(console.error)
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
      console.error(err.message)
      res.status(400).json({
        data: representativesAccumulator,
        success: false
      })
      console.log(err)
    })
}

exports.getPastParliaments = (req, res) => {
  const parliaments = [36, 37, 38, 39, 40, 41, 42]
  const riding = 'nunavut'
  const db = new Firestore(false)
  let politicians = parliaments.map(parl => {
    return db.forParliament(parl)
      .Politicians()
      .where('riding', '==', riding)
      .select()
      .then(snapshot => {
        let ret = {}
        snapshot.forEach(doc => {
          ret = doc.data()
        })
        return ret
      })
    res.status(200).json({
      data: repInfo,
      success: true
    })
  })
  politicians = await Promise.all(politicians)
  politicians.forEach(politicians => {
    console.log(politicians)
  })
}

// getRepresentativesInfo
exports.getRepresentativesInfo = (req, res) => {
  const name = req.params.name.toLowerCase()
  let repInfo = {}
  const db = new Firestore()
  db.Politician()
    .select('name', '==', name)
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        const {
          name,
          politicalParty,
          riding,
          yearElected,
          imageUrl
        } = doc.data()
        repInfo = {
          name: name,
          politicalParty: politicalParty,
          riding: riding,
          yearElected: yearElected,
          imageUrl: imageUrl
        }
      })
      res.status(200).json({
        data: repInfo,
        success: true
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
}

exports.getRepresentativeId = async (req, res) => {
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
