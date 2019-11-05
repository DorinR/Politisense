import { Firestore } from '../client/src/Firebase'

exports.getVotesByRepresentative = async (req, res) => {
  const representative = req.params.representative.toLowerCase()
  var allBillsVotedOn = []
  const db = new Firestore()
  db.VoteRecord()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'Voting Record Not Found',
          success: false
        })
      }
      var countDocs = 0
      snapshot.forEach(doc => {
        countDocs++
      })
      snapshot.forEach(doc => {
        let { billId, voteId, voteName, voters } = doc.data()
        let representativeVotedOnThisBill = false
        voters.forEach(rep => {
          let mutableRep = representative
          let areEqual =
            rep.representative.toLowerCase() === mutableRep.toLowerCase()
          if (areEqual) {
            representativeVotedOnThisBill = true
          }
        })
        if (!representativeVotedOnThisBill) {
          countDocs--
        }
        if (representativeVotedOnThisBill) {
          let bill = {
            billId: billId,
            voteId: voteId,
            voteName: voteName,
            voters: voters
          }
          bill['representativeVote'] = 'unknown'
          voters.forEach(item => {
            if (item.representative === representative) {
              bill['representativeVote'] = item.vote
            }
          })
          db.Bill()
            .select('billId', '==', bill.billId)
            .then(snapshot => {
              if (snapshot.empty) {
                res.status(400).json({
                  message: 'Bill ID not found',
                  success: false
                })
              }
              snapshot.forEach(doc => {
                let {
                  billNumber,
                  billSummary,
                  billText,
                  dateVoted
                } = doc.data()
                ;(bill['billNumber'] = billNumber),
                  (bill['billSummary'] = billSummary),
                  (bill['billText'] = billText),
                  (bill['dateVoted'] = dateVoted)

                allBillsVotedOn.push(bill)
              })
              if (allBillsVotedOn.length === countDocs) {
                return res.status(200).json({
                  success: true,
                  data: allBillsVotedOn
                })
              }
            })
        } else {
          console.log('representative did not vote on this bill')
        }
      })
    })
    .catch(err => {
      res.status(400).json({
        message: 'Error retriving user',
        success: false
      })
    })
}
