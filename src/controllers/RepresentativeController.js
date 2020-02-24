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


exports.Parliament42 = (req, res) => {
  const timePeriod42 = []
  const db = new Firestore()
  db.Parliament42()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'No Representatives Found in Database',
          success: false
        })
      }
      snapshot.forEach(doc => {
        timePeriod42.push(doc.data())
      })

      if (!timePeriod42.empty) {
        res.status(200).json({
          data: timePeriod42,
          success: true
        })
      }
    })
    .catch(err => {
      console.error(err.message)
      res.status(400).json({
        data: timePeriod42,
        success: false
      })
      console.log(err)
    })
}

exports.Parliament41 = (req, res) => {
  const timePeriod41 = []
  const db = new Firestore()
  db.Parliament41()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'No Representatives Found in Database',
          success: false
        })
      }
      snapshot.forEach(doc => {
        timePeriod41.push(doc.data())
      })

      if (!timePeriod41.empty) {
        res.status(200).json({
          data: timePeriod41,
          success: true
        })
      }
    })
    .catch(err => {
      console.error(err.message)
      res.status(400).json({
        data: timePeriod41,
        success: false
      })
      console.log(err)
    })
}

exports.Parliament40 = (req, res) => {
  const timePeriod40 = []
  const db = new Firestore()
  db.Parliament40()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'No Representatives Found in Database',
          success: false
        })
      }
      snapshot.forEach(doc => {
        timePeriod40.push(doc.data())
      })

      if (!timePeriod40.empty) {
        res.status(200).json({
          data: timePeriod40,
          success: true
        })
      }
    })
    .catch(err => {
      console.error(err.message)
      res.status(400).json({
        data: timePeriod40,
        success: false
      })
      console.log(err)
    })
}

exports.Parliament39 = (req, res) => {
  const timePeriod39 = []
  const db = new Firestore()
  db.Parliament39()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'No Representatives Found in Database',
          success: false
        })
      }
      snapshot.forEach(doc => {
        timePeriod39.push(doc.data())
      })

      if (!timePeriod39.empty) {
        res.status(200).json({
          data: timePeriod39,
          success: true
        })
      }
    })
    .catch(err => {
      console.error(err.message)
      res.status(400).json({
        data: timePeriod39,
        success: false
      })
      console.log(err)
    })
}

exports.Parliament38 = (req, res) => {
  const timePeriod38 = []
  const db = new Firestore()
  db.Parliament38()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'No Representatives Found in Database',
          success: false
        })
      }
      snapshot.forEach(doc => {
        timePeriod38.push(doc.data())
      })

      if (!timePeriod38.empty) {
        res.status(200).json({
          data: timePeriod38,
          success: true
        })
      }
    })
    .catch(err => {
      console.error(err.message)
      res.status(400).json({
        data: timePeriod38,
        success: false
      })
      console.log(err)
    })
}

exports.Parliament37 = (req, res) => {
  const timePeriod37 = []
  const db = new Firestore()
  db.Parliament37()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'No Representatives Found in Database',
          success: false
        })
      }
      snapshot.forEach(doc => {
        timePeriod37.push(doc.data())
      })

      if (!timePeriod38.empty) {
        res.status(200).json({
          data: timePeriod37,
          success: true
        })
      }
    })
    .catch(err => {
      console.error(err.message)
      res.status(400).json({
        data: timePeriod37,
        success: false
      })
      console.log(err)
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
