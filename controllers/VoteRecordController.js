import { Firestore } from '../client/src/Firebase'

exports.getVotesByRepresentative = async (req, res) => {
  let representative = req.params.representative.toLowerCase()
  var allBillsVotedOn = []
  let db = new Firestore()

  function getSupplementalBillInformation(bill) {
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
          (bill['billTitle'] = title),
            (bill['billText'] = text),
            (bill['dateVoted'] = dateVoted)

          allBillsVotedOn.push(bill)
        })
        db.close()
      })
      .catch(err => {
        db.close()
        res.status(400).json({
          message: 'Error retriving bill',
          success: false
        })
      })
  }

  function getAllBillsVotedOnByRepresentative(representative) {
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
          let { billNumber, voteId, voteName, voters } = doc.data()
          let representativeVote = voters[representative]['vote']
          if (representativeVote) {
            let bill = {
              billNumber: billNumber,
              voteId: voteId,
              voteName: voteName,
              voters: voters
            }
            bill['representativeVote'] = voters[representative]['vote']

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
      })
  }
  getAllBillsVotedOnByRepresentative(representative)
}
