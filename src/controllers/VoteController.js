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

exports.getPastRepresentativesVotes = async (req, res) => {
  console.log("TEST PAST RECORDS")
  const representativesVoteAccumulator = []
  const member = 'cP0FiFwOuobtHAMx5wUE'
  const parliaments = [40]
  const db = new Firestore(false)
  let politicians = parliaments.map(parl => {
    return db
      .forParliament(parl)
      .Vote()
      .where('member', '==', member)
      .select()
      .then(snapshot => {
        let ret = {}
        snapshot.forEach(doc => {
          console.log(doc.data())
          ret = doc.data()
        })
        return ret
      })
  })
  politicians = await Promise.all(politicians)
  politicians.forEach(pol => {
    if (Object.keys(pol).length !== 0) {
      representativesVoteAccumulator.push(pol)
    }
  })
  if (representativesVoteAccumulator.length === 0) {
    res.status(404).json({
      success: false,
      message: 'No politicians found for those ridings'
    })
  } else {
    res.status(200).json({
      data: representativesAccumulator,
      success: true
    })
  }
}
