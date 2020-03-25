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

// exports.getPastRepresentativesVotes = async (req, res) => {
//   const representativesVoteAccumulator = []
//   console.log(`received from frontend: ${req.params.member}`)
//   const parliaments = [40]
//   const db = new Firestore(false)
//   let politiciansVotes = parliaments.map(parl => {
//     return db
//       .forParliament(parl)
//       .Vote()
//       .where('member', '==', req.params.member)
//       .select()
//       .then(snapshot => {
//         let vote = {}
//         snapshot.forEach(doc => {
//           vote = doc.data()
//           console.log(`vote 1 `, vote)
//         })
//         console.log(`vote 2 `, vote)
//         return vote
//       })
//   })
//   politiciansVotes = await Promise.all(politiciansVotes)
//   console.log(`politiciansVotes 1 `, politiciansVotes)
//   politiciansVotes.forEach(pol => {
//     if (Object.keys(pol).length !== 0) {
//       representativesVoteAccumulator.push(pol)
//     }
//   })
//   console.log(`politiciansVotes 2 `, politiciansVotes)
//   console.log(`representativesVoteAccumulator `, representativesVoteAccumulator)
//   if (representativesVoteAccumulator.length === 0) {
//     res.status(404).json({
//       success: false,
//       message: 'No politicians found for those ridings'
//     })
//   } else {
//     console.log(`representativesVoteAccumulator 2 `, representativesVoteAccumulator)
//     res.status(200).json({
//       data: representativesVoteAccumulator,
//       success: true
//     })
//   }
// }

// exports.getPastRepresentativesVotes = async (req, res) => {
//   const representativesVoteAccumulator = []
//   console.log(`received from frontend: ${req.params.member}`)
//   const parliaments = [36, 37, 38, 39, 40, 41, 42]
//   const db = new Firestore(false)
//   let politiciansVotes = parliaments.map(parl => {
//     return db
//       .forParliament(parl)
//       .Vote()
//       .where('member', '==', req.params.member)
//       .select()
//       .then(snapshot => {
//         if (snapshot.empty) {
//           res.status(400).json({
//             success: false,
//             message: 'No Bills Currently Stored'
//           })
//         } else {
//           snapshot.forEach(doc => {
//             representativesVoteAccumulator.push(doc.data())
//           })
//           console.log(`total bills `, representativesVoteAccumulator.length)
//           res.status(200).json({
//             success: true,
//             data: representativesVoteAccumulator.length
//           })
//         }
//       })
//       .catch(console.error)
//   })
//   politiciansVotes = await Promise.all(politicians)
// }

exports.getPastRepresentativesPairedVotes = async (req, res) => {
  console.log(`received from frontend: ${req.params.member}`)
  const parliaments = [36, 37, 38, 39, 40, 41, 42]
  const db = new Firestore(false)
  let politiciansVotes = parliaments.map(parl => {
    return db
      .forParliament(parl)
      .Vote()
      .where('member', '==', req.params.member)
      .where('paired', '==', true)
      .select()
      .then(snapshot => {
        snapshot.forEach(doc => {
          docs.push(doc.data())
        })
        return docs
      })
  })
  Promise.all(politiciansVotes)
    .then(votes => {
      res.status(200).json({
        success: true,
        data: doc.data()
      })
        .catch(console.error)
    })
}

exports.getPastRepresentativesVotes = async (req, res) => {
  console.log(`received from frontend: ${req.params.member}`)
  const parliaments = [36, 37, 38, 39, 40, 41, 42]
  const db = new Firestore(false)
  let politiciansVotes = parliaments.map(parl => {
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
        success:false,
        message: e.message
      })
    })
}
