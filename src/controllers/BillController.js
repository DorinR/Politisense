import { mergeArrays } from '../../client/src/Components/Dashboard/Utilities/CommonUsedFunctions'
const Firestore = require('@firestore').Firestore
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
                  data: finalArray.length
                })
              })
          }
        })
    })
}

async function fetchIDbyPoliticianName(parliamentNo, repName) {
  const db = new Firestore(false).forParliament(parliamentNo)
  let id = null
  await db.Politician()
    .where('name', '==', repName)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('this MP didnt exist in this parliament')
        return id
      }
      snapshot.forEach(doc => {
        id = doc.id
      })
      return id
    })
  return id
}

async function getAllVoteRecordsByRep(repId, parliamentNo) {
  const db = new Firestore(false).forParliament(parliamentNo)
  const votes = db.Vote()
  const voteRecord = db.VoteRecord().where('type', '==', 'assent')
  const allVotes = []
  await votes
    .where('member', '==', repId)
    .innerJoin('vote', voteRecord, '_id')
    .then(result => {
      result.forEach(element => {
        allVotes.push(element)
      })
      return allVotes
    }).catch(e => console.log('invalid parameters in inner join or in where clause', e))
  return allVotes
}
async function getAllBillsByParliamentAndRep(parliamentNo, repName) {
  const db = new Firestore(false).forParliament(parliamentNo)
  const bills = db.Bill()
  const billClassification = db.BillClassification()
  const repId = await fetchIDbyPoliticianName(parliamentNo, repName)
  const finalArray = []
  if (repId) {
    const allVotes = await getAllVoteRecordsByRep(repId, parliamentNo)
    if (allVotes) {
      await bills
        .innerJoin('_id', billClassification, 'bill')
        .then(billTable => {
          if (billTable.empty) {
            console.log('there is no bills for this parliament')
            return []
          }
          allVotes.forEach(data => {
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
        }).catch(e => console.log('invalid parameters for inner join ', e))
    }
  }
  return finalArray
}

exports.getAllBillsByRepForAllParliaments = async (req, res) => {
  const repName = req.params.head.toLowerCase()
  const parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
  const rawData = await Promise.all(
    parliaments.map(parliament => {
      return getAllBillsByParliamentAndRep(parliament, repName)
    })
  )
  const jointArray = mergeArrays(rawData)

  res.status(200).json({
    success: true,
    data: jointArray
  })
}

async function getBillsClassifiedBySponsor(parliamentNo, repName) {
  const db = new Firestore(false).forParliament(parliamentNo)
  const bill = db.Bill()
  const billClassification = db.BillClassification()
  const billsWithClassification = []

  await bill
    .where('sponsorName', '==', repName)
    .innerJoin('_id', billClassification, 'bill')
    .then(result => {
      if (result.empty) {
        console.log('No sponsored bills for ' + repName)
        return []
      }
      result.forEach(bill => {
        billsWithClassification.push(bill)
      })
    }).catch(e => console.log('invalid parameters for inner join', e))
  return billsWithClassification
}
// we should have 14 unique bills
// we should have 14 voting records
async function getVotingRecordsForBills(repName, parliamentNo) {
  const db = new Firestore(false).forParliament(parliamentNo)
  const voteRecord = db.VoteRecord().where('type', '==', 'assent')
  const billsTotalVotes = []
  await db.Bill()
    .where('sponsorName', '==', repName)
    .innerJoin('_id', voteRecord, 'bill')
    .then(data => {
      data.forEach(bill => {
        billsTotalVotes.push(bill)
      })
    }).catch(e => console.log('invalid repName or invalid parameters in inner join', e))
  return billsTotalVotes
}
async function extractAllBillsAndVotingRecordsByParliamentAndSponsor(parliamentNo, repName) {
  const finalArray = []
  const classifiedBills = await getBillsClassifiedBySponsor(parliamentNo, repName)
  const votingRecords = await getVotingRecordsForBills(repName, parliamentNo)

  if (classifiedBills.length !== 0 && votingRecords.length !== 0) {
    classifiedBills.forEach((classifiedBill) => {
      votingRecords.forEach((votingRecord) => {
        if (classifiedBill.bill === votingRecord.bill) {
          const temp = {
            billsClassified: classifiedBill,
            voteRecord: votingRecord
          }
          finalArray.push(temp)
        }
      })
    })
  }
  return finalArray
}

async function fetchBillsByParliamentAndSponsor(parliamentNo, repName) {
  const id = await fetchIDbyPoliticianName(parliamentNo, repName)
  let bills = []
  if (id) {
    bills = await extractAllBillsAndVotingRecordsByParliamentAndSponsor(parliamentNo, repName)
  }
  return bills
}

async function getAllBillsByParliamentWithoutRep(parliamentNo) {
  const db = new Firestore().forParliament(parliamentNo)
  const billClassification = db.BillClassification()
  const bills = []
  await billClassification.select().then(snapshot => {
    if (snapshot.empty) {
      console.log('no data for this parliament ')
      return []
    }
    snapshot.forEach(doc => {
      bills.push(doc.data())
    })
  }).catch(e => console.log(e))
  return bills
}
exports.fetchCategories = async (req, res) => {
  const parliaments = [39, 40, 41, 42, 43]
  const rawData = await Promise.all(
    parliaments.map(parliament => {
      return getAllBillsByParliamentWithoutRep(parliament)
    })
  )
  const jointedArray = mergeArrays(rawData)
  let categories = [...new Set(jointedArray.map(item => item.category))]
  categories = categories.filter(category => category !== null && category !== undefined && category !== '')

  res.status(200).json({
    success: true,
    data: categories
  })
}

exports.getAllBillsBySponsorForAllParliaments = async (req, res) => {
  const repName = req.params.head.toLowerCase()
  const parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
  const rawData = await Promise.all(
    parliaments.map(parliament => {
      return fetchBillsByParliamentAndSponsor(parliament, repName)
    })
  )
  const bills = mergeArrays(rawData)
  res.status(200).json({
    success: true,
    data: bills
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
      .where('party', '==', party)
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
                console.error('bill assent data not found')
              }
              result.forEach(doc => {
                if (doc.data().assent) {
                  billsSucceededCount++
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

async function getIssuedBillsParliament43(parliamentNo, repName) {
  const db = new Firestore(false).forParliament(parliamentNo)
  const bill = db.Bill()
  const sponsoredBills = []

  await bill
    .where('sponsorName', '==', repName)
    .select()
    .then(result => {
      if (result.empty) {
        console.log('No sponsored bills for ' + repName)
        return []
      }
      result.forEach(bill => {
        sponsoredBills.push(bill)
      })
    }).catch(e => console.log('invalid parameters', e))
  return sponsoredBills
}

exports.getAllBillsBySponsorName = async (req, res) => {
  const repName = req.params.head.toLowerCase()
  const parliament = 43
  const rawData = await getIssuedBillsParliament43(parliament, repName)
  res.status(200).json({
    success: true,
    data: rawData.length
  })
}
