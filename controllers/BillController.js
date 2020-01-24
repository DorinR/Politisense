import { Firestore } from '../client/src/Firebase'

exports.getAllBillsByHead = (req, res) => {
  const db = new Firestore()
  const votes = db.Vote()
  const representative = req.params.head.toLowerCase()
  const voteRecord = db.VoteRecord()
  const bills = db.Bill()
  const billClassification = db.BillClassification()

  const finalArray = []
  const test = []
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
      votes
        .where('member', '==', repId)
        .innerJoin('vote', voteRecord, '_id')
        .then(result => {
          result.forEach(element => {
            test.push(element)
          })
          if (result) {
            bills
              .innerJoin('_id', billClassification, 'bill')
              .then(billTable => {
                for (let i = 0; i < result.length; i++) {
                  for (let j = 0; j < billTable.length; j++) {
                    if (result[i].bill === billTable[j].bill) {
                      const temp = {
                        voteRecord: result[i],
                        billData: billTable[j]
                      }
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

exports.getAllBills = async (req, res) => {
  const db = new Firestore()
  const allBills = []
  await db
    .Bill()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          success: false,
          message: 'No Bills Currently Stored'
        })
      }
      snapshot.forEach(doc => {
        const { dateVoted, link, number, sponsorName, title } = doc.data()
        const bill = {
          id: doc.id,
          dateVoted,
          link,
          number,
          sponsorName,
          title
        }

        allBills.push(bill)
      })
      res.status(200).json({
        success: true,
        data: allBills
      })
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        message: err
      })
    })
}
