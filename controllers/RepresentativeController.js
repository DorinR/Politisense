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
      console.error(err)
      res.status(400).json({
        data: representativesAccumulator,
        success: false
      })
      console.log(err)
    })
}

//getRepresentativesInfo
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
                const { name, politicalParty, riding, yearElected,imageUrl } = doc.data()
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