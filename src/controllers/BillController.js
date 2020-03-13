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
                  data: finalArray
                })
              })
          }
        })
    })
}

async function fetchIDbyPoliticianName (parliamentNo,repName) {
    const db = new Firestore(false).forParliament(parliamentNo)
    let id =null
    await db.Politician()
        .where('name','==',repName)
        .select()
        .then(snapshot => {
            if (snapshot.empty) {
                return "nothing there 1"
            }
            snapshot.forEach(doc => {
                id = doc.id
            })
            return id
        })
    return id
}

async function getAllVoteRecordsByRep(repId,parliamentNo){
    const db = new Firestore(false).forParliament(parliamentNo)
    const votes = db.Vote()
    const voteRecord = db.VoteRecord().where('type','==','assent')
    let allVotes=  []
    await votes
        .where('member', '==', repId)
        .innerJoin('vote', voteRecord, '_id')
        .then(result => {
            result.forEach(element => {
                allVotes.push(element)
            })
            return allVotes
        })
    return allVotes
}
async function getAllBillsByParliamentAndRep (parliamentNo,repName) {
    const db = new Firestore(false).forParliament(parliamentNo)
    const bills = db.Bill()
    const billClassification = db.BillClassification()
    let repId = await fetchIDbyPoliticianName(parliamentNo,repName)
    let finalArray=[]
    if(repId){
        let allVotes = await getAllVoteRecordsByRep(repId,parliamentNo)
        if(allVotes){
            await bills
                .innerJoin('_id', billClassification, 'bill')
                .then(billTable => {
                    if (billTable.empty) {
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
                    return finalArray
                })
            return finalArray
        }
        return finalArray
    }
}
function mergeArrays(rawData){
    let jointArray = []

    rawData.forEach(array => {
        if(array){
            jointArray = [...jointArray, ...array]}
    });
    let test=  [...new Set([...jointArray])]
    return test
}
exports.getAllBillsByRepForAllParliaments = async (req, res) => {
    const repName = req.params.head.toLowerCase()
    let rawData = await Promise.all([
        getAllBillsByParliamentAndRep(43,repName),
        getAllBillsByParliamentAndRep(42,repName),
        getAllBillsByParliamentAndRep(41,repName),
        getAllBillsByParliamentAndRep(40,repName),
        getAllBillsByParliamentAndRep(39,repName),
        getAllBillsByParliamentAndRep(38,repName),
        getAllBillsByParliamentAndRep(37,repName),
        getAllBillsByParliamentAndRep(36,repName),
    ])
    let jointArray = mergeArrays(rawData)

    res.status(200).json({
        success: true,
        data: jointArray
    })
}

async function getBillsClassifiedBySponsor(parliamentNo,repName){
    const db = new Firestore(false).forParliament(parliamentNo)
    const bill= db.Bill()
    const billClassification = db.BillClassification()
    const billsWithClassification = []

    await bill
        .where('sponsorName', '==', repName)
        .innerJoin('_id', billClassification, 'bill')
        .then(result => {
            if (result.empty) {
                return []
            }
            result.forEach(bill => {
                billsWithClassification.push(bill)
            })
            return billsWithClassification
        })
    return billsWithClassification
}
// we should have 14 unique bills
// we should have 14 voting records
async function getVotingRecordsForBills(repName,parliamentNo){
    const db = new Firestore(false).forParliament(parliamentNo)
    const voteRecord = db.VoteRecord().where('type','==','assent')
    let billsTotalVotes = []
    let counter = 0
     await db.Bill()
        .where('sponsorName', '==', repName)
        .innerJoin('_id', voteRecord, 'bill')
        .then(data => {
            data.forEach(bill => {
                counter++
                billsTotalVotes.push(bill)
            })
            return billsTotalVotes
        })
    return billsTotalVotes
}
async function extractAllBillsAndVotingRecordsByParliamentAndSponsor (parliamentNo,repName) {
    let finalArray = []
    let classifiedBills = await getBillsClassifiedBySponsor(parliamentNo,repName)
    let votingRecords = await getVotingRecordsForBills(repName,parliamentNo)

    if(classifiedBills.length != 0 && votingRecords.length != 0){
        for (let i = 0; i < classifiedBills.length; i++) {
            for (let j = 0; j < votingRecords.length; j++) {
                if (
                    classifiedBills[i].bill === votingRecords[j].bill
                ) {
                    const temp = {
                        billsClassified: classifiedBills[i],
                        voteRecord: votingRecords[j]
                    }
                    finalArray.push(temp)
                }
            }
        }
        return finalArray
    }
}

async function fetchBillsByParliamentAndSponsor (parliamentNo,repName) {
    let id = await fetchIDbyPoliticianName(parliamentNo,repName)
    if(id){
        let bills =await extractAllBillsAndVotingRecordsByParliamentAndSponsor(parliamentNo,repName)
        if(bills){
            return bills
        }else {
            return []
        }
    }
    return []
}

async function getAllBillsByParliamentWithoutRep (parliamentNo){
    const db = new Firestore(false).forParliament(parliamentNo)
    const billClassification = db.BillClassification()
    let bills=[]
    await billClassification.select().then(snapshot=>{
        if(snapshot.empty){
            return []
        }
        snapshot.forEach(doc=>{
            bills.push(doc.data())
        })
    })
    return bills
}
exports.fetchCategories = async(req,res)=>{
    let rawData = await Promise.all([
        getAllBillsByParliamentWithoutRep(43),
        getAllBillsByParliamentWithoutRep(42),
        getAllBillsByParliamentWithoutRep(41),
        getAllBillsByParliamentWithoutRep(40),
        getAllBillsByParliamentWithoutRep(39),
        getAllBillsByParliamentWithoutRep(38),
        getAllBillsByParliamentWithoutRep(37),
        getAllBillsByParliamentWithoutRep(36)
    ])

    let jointedArray= mergeArrays(rawData)
    let categories = [...new Set(jointedArray.map(item => item.category))]
    categories= categories.filter(category=>category != null )

    res.status(200).json({
        success: true,
        data: categories
    })
}

exports.getAllBillsBySponsorForAllParliaments = async (req, res) => {
    const repName = req.params.head.toLowerCase()
    let rawData = await Promise.all([
        fetchBillsByParliamentAndSponsor(43,repName),
        fetchBillsByParliamentAndSponsor(42,repName),
        fetchBillsByParliamentAndSponsor(41,repName),
        fetchBillsByParliamentAndSponsor(40,repName),
        fetchBillsByParliamentAndSponsor(39,repName),
        fetchBillsByParliamentAndSponsor(38,repName),
        fetchBillsByParliamentAndSponsor(37,repName),
        fetchBillsByParliamentAndSponsor(36,repName),
    ])

    let bills = mergeArrays(rawData)
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
