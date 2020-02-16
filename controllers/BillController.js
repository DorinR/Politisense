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
                result.forEach(data => {
                  billTable.forEach(bill => {
                    if (data.bill === bill.bill) {
                      const temp = {
                        voteRecord: data,
                        billData: bill
                      }
                      finalArray.push(temp)
                    }
                  })
                })
                res.json({
                  success: true,
                  data: finalArray
                })
              })
          }
        })
    })
}

exports.getAllBillsByRep = (req, res) => {
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
                result.forEach(data => {
                  billTable.forEach(bill => {
                    if (data.bill === bill.bill) {
                      const temp = {
                        voteRecord: data,
                        billData: bill
                      }
                      finalArray.push(temp)
                    }
                  })
                })

                res.json({
                  success: true,
                  data: finalArray
                })
              })
          }
        })
    })
}

exports.getAllBillsBySponsorName = (req, res) => {
  const db = new Firestore()
  const voteRecord = db.VoteRecord()
  const billClassification = db.BillClassification()
  const sponsor = req.params.head.toLowerCase()
  const billsWithClassification = []
  const billsTotalVotes = []
  const finalArray = []

  db.Bill()
    .where('sponsorName', '==', sponsor)
    .innerJoin('_id', billClassification, 'bill')
    .then(result => {
      if (result.empty) {
        res.status(400).json({
          message: 'Rep Not Found',
          success: false
        })
      }
      result.forEach(bill => {
        billsWithClassification.push(bill)
      })

      db.Bill()
        .where('sponsorName', '==', sponsor)
        .innerJoin('_id', voteRecord, 'bill')
        .then(data => {
          data.forEach(bill => {
            billsTotalVotes.push(bill)
          })

          if (billClassification.length !== 0 && billsTotalVotes.length !== 0) {
            for (let i = 0; i < billsWithClassification.length; i++) {
              for (let j = 0; j < billsTotalVotes.length; j++) {
                if (
                  billsWithClassification[i].bill === billsTotalVotes[j].bill
                ) {
                  const temp = {
                    billsClassified: billsWithClassification[i],
                    voteRecord: billsTotalVotes[j]
                  }
                  finalArray.push(temp)
                }
              }
            }

            res.json({
              success: true,
              data: finalArray
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
      votes
        .where('member', '==', repId)
        .innerJoin('vote', voteRecord, '_id')
        .then(result => {
          result.forEach(element => {
            arr.push(element)
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

exports.getNumberOfBillsSponsoredByParty = async (req, res) => {
  const party = req.params.party
  const db = new Firestore()
  const bills = db.Bill()
  const politicians = db.Politician()
  let billsSponsoredCount = 0
  const billsAccumulator = []

  new Promise((resolve, reject) => {
    politicians
      .where('politicalParty', '==', party)
      .innerJoin('name', bills, 'sponsorName')
      .then(result => {
        if (result.empty) {
          res.status(400).json({
            success: false,
            message: `No bills found for party ${party}`
          })
        } else {
          result.forEach(r => {
            billsSponsoredCount++
            billsAccumulator.push(r)
          })
          resolve(billsAccumulator)
        }
      })
      .catch(console.error)
  })
    .then(bills => {
      return new Promise((resolve, reject) => {
        let billsSucceededCount = 0
        bills.forEach(b => {
          db.VoteRecord()
            .where('billNumber', '==', b.number)
            .select()
            .then(result => {
              if (result.empty) {
                console.log('bill assent data not found')
              }
              result.forEach(doc => {
                console.log(`bill extra data: ${doc.data().assent}`)
                if (doc.data().assent) {
                  billsSucceededCount++
                  console.log(`COUNT: ${billsSucceededCount}`)
                }
              })
              return billsSucceededCount
            })
            .catch(console.error)
        })
        setTimeout(() => {
          resolve(billsSucceededCount)
        }, 500)
      })
    })
    .then(billsSucceeded => {
      res.status(200).json({
        success: true,
        data: {
          totalBills: billsSponsoredCount,
          billsSucceeded: billsSucceeded
        }
      })
    })
}
