<<<<<<< HEAD:src/controllers/VoteRecordController.js
const Firestore = require('@firestore').Firestore
=======
import { Firestore } from '../client/src/backend/firebase/Firestore'
>>>>>>> #211 [feature/scraper-refactor] : refactored backend to be easier to traverse:controllers/VoteRecordController.js

exports.getVotesByRepresentative = async (req, res) => {
  const representative = req.params.representative.toLowerCase()
  let allBillsVotedOn = []
  const db = new Firestore()

  function getSupplementalBillInformation (bill) {
    db.Bill()
      .select('number', '==', bill.billNumber)
      .then(snapshot => {
        if (snapshot.empty) {
          res.status(400).json({
            message: 'Bill ID not found',
            success: false
          })
        }
        snapshot.forEach(doc => {
          const { title, text, dateVoted } = doc.data()
          bill.billTitle = title
          bill.billText = text
          bill.dateVoted = dateVoted

          allBillsVotedOn.push(bill)
        })
      })
      .catch(err => {
        res.status(400).json({
          message: 'Error retriving bill',
          success: false
        })
        console.error(err)
      })
  }

  function getAllBillsVotedOnByRepresentative (representative) {
    allBillsVotedOn = []
    db.VoteRecord()
      .select()
      .then(snapshot => {
        if (snapshot.empty) {
          res.status(400).json({
            message: 'Voting Record Not Found',
            success: false
          })
        }
        snapshot.forEach(doc => {
          const { billNumber, voteId, voteName, voters } = doc.data()
          const representativeVote = voters[representative].vote
          if (representativeVote) {
            const bill = {
              billNumber: billNumber,
              voteId: voteId,
              voteName: voteName,
              voters: voters
            }
            bill.representativeVote = voters[representative].vote

            getSupplementalBillInformation(bill)
          }
        })
        setTimeout(() => {
          return res.status(200).json({
            success: true,
            data: allBillsVotedOn
          })
        }, 300)
      })
      .catch(err => {
        res.status(400).json({
          message: 'Error retriving bill',
          success: false
        })
        console.error(err)
      })
  }
  getAllBillsVotedOnByRepresentative(representative)
}

exports.getAllVoteRecords = async (req, res) => {
  const db = new Firestore()
  const voteRecords = []
  db.VoteRecord()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).json({
          success: true,
          message: 'No vote records currently stored in firestore'
        })
      }

      snapshot.forEach(doc => {
        const { bill, billNumber } = doc.data()
        const voteRecord = {
          id: doc.id,
          bill,
          billNumber
        }
        voteRecords.push(voteRecord)
      })

      res.status(200).json({
        success: true,
        data: voteRecords
      })
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        message: err
      })
    })
}
