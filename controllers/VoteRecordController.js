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
        let { billNumber, voteId, voteName, voters } = doc.data()
        let representativeVotedOnThisBill = false
        let representativeVote = voters[representative]['vote']
        if (representativeVote) {
          representativeVotedOnThisBill = true
        }

        if (!representativeVotedOnThisBill) {
          countDocs--
        }
        if (representativeVotedOnThisBill) {
          let bill = {
            billNumber: billNumber,
            voteId: voteId,
            voteName: voteName,
            voters: voters
          }
          bill['representativeVote'] = voters[representative]['vote']

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
                let { title, text, dateVoted } = doc.data()
                ;(bill['billTitle'] = title),
                  (bill['billText'] = text),
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
