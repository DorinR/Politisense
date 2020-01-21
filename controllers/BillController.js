import { Firestore } from '../client/src/Firebase'

exports.getBillById = (req, res) => {
  console.log('getBillById endpoint was successfully callled')
}

exports.getVotedBillsByMP = (req, res) => {
  const db = new Firestore()
  const votes = db.Vote()
  const representative = req.params.head.toLowerCase()
  const voteRecord = db.VoteRecord()
  const bills = db.Bill()
  const billClassification = db.BillClassification()

  const finalArray = []
  const arr = []
  let repId = ''
  db.Politician()
    .select('name', '==', representative)
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'Rep Not Found',
          success: false
        })
      }
      snapshot.forEach(doc => {
        repId = doc.id
      })
      votes.where('member', '==', repId).innerJoin('vote', voteRecord, '_id').then(result => {
        result.forEach(element => {
          arr.push(element)
        })
        if (result) {
          bills.innerJoin('_id', billClassification, 'bill').then(billTable => {
            for (let i = 0; i < result.length; i++) {
              for (let j = 0; j < billTable.length; j++) {
                if (result[i].bill === billTable[j].bill) {
                  const temp = { voteRecord: result[i], billData: billTable[j] }
                  console.log(temp)
                  finalArray.push(temp)
                }
              }
            }
            res.json({
              success: true,
              data: finalArray
            })
          })
        }
      })
    })
}
