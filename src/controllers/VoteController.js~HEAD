<<<<<<< HEAD:src/controllers/VoteController.js
const Firestore = require('@firestore').Firestore
=======
import { Firestore } from '../client/src/backend/firebase/Firestore'
>>>>>>> #211 [feature/scraper-refactor] : refactored backend to be easier to traverse:controllers/VoteController.js

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
