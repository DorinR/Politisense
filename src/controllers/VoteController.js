const Firestore = require('@firestore').Firestore

exports.getAllVotesByRepresentative = async (req, res) => {
  const targetRepresentative = req.params.representativeId
  const db = new Firestore()
  const allVotes = []
  await db
    .Vote()
    .where('member', '==', targetRepresentative)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          success: false,
          message: 'No Bills Currently Stored'
        })
      } else {
        snapshot.forEach(doc => {
          allVotes.push(doc.data())
        })
        res.status(200).json({
          success: true,
          data: allVotes
        })
      }
    })
    .catch(console.error)
}

exports.getPastRepresentativePairedVotes = async (req, res) => {
  const parliaments = [36, 37, 38, 39, 40, 41, 42]
  const db = new Firestore(false)
  const politiciansVotes = parliaments.map(parl => {
    return db
      .forParliament(parl)
      .Vote()
      .where('member', '==', req.params.member)
      .where('paired', '==', true)
      .select()
      .then(snapshot => {
        const docs = []
        snapshot.forEach(doc => {
          docs.push({
            data: doc.data(),
            parliament: parl
          })
        })
        return docs
      })
  })
  Promise.all(politiciansVotes)
    .then(votes => {
      res.status(200).json({
        success: true,
        data: votes.flat()
      })
    })
    .catch(e => {
      console.error(e)
      res.status(500).json({
        success: false,
        message: e.message
      })
    })
}

exports.getPastRepresentativeVotes = async (req, res) => {
  const parliaments = [36, 37, 38, 39, 40, 41, 42]
  const db = new Firestore(false)
  const politiciansVotes = parliaments.map(parl => {
    return db
      .forParliament(parl)
      .Vote()
      .where('member', '==', req.params.member)
      .select()
      .then(snapshot => {
        const docs = []
        snapshot.forEach(doc => {
          docs.push({
            data: doc.data(),
            parliament: parl
          })
        })
        return docs
      })
  })

  Promise.all(politiciansVotes)
    .then(votes => {
      res.status(200).json({
        success: true,
        data: votes.flat()
      })
    })
    .catch(e => {
      console.error(e)
      res.status(500).json({
        success: false,
        message: e.message
      })
    })
}
