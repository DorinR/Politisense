import { Firestore } from '../client/src/Firebase'

exports.getVotesByRepresentative = (req, res) => {
  console.log('getVotesByRep endpoint hit')
  const representative = req.body.representative
  let allBillsVotedOn = []
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

      snapshot.forEach(doc => {
        let { billId, voteId, voteName, voters } = doc.data()
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
              let { billNumber, billSummary, billText, dateVoted } = doc.data()
              ;(bill['billNumber'] = billNumber),
                (bill['billSummary'] = billSummary),
                (bill['billText'] = billText),
                (bill['dateVoted'] = dateVoted)

              allBillsVotedOn.push(bill)
            })
            res.status(200).json({
              success: true,
              data: allBillsVotedOn
            })
          })
          .catch(
            err =>
              res.status(404).json({
                message: 'Error finding bills corresponding to representative',
                success: false
              }),
            Promise.reject(err)
          )
      })
    })
    .catch(err =>
      res.status(404).json({
        message: 'Error getting bills voted on by representative',
        success: false
      })
    )
  // console.log('here are all the bills')
  // console.log(allBillsVotedOn)
}
