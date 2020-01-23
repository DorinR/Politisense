import { Firestore } from '../client/src/Firebase'

exports.getBillById = (req, res) => {
  console.log('getBillById endpoint was successfully callled')
}

exports.getAllBillsByRep = (req, res) =>  {
  console.log('getAllBillsByHead endpoint was successfully callled')
  let records = []
  const db = new Firestore()
  let votes = db.Vote()
  let representative = req.params.head.toLowerCase()
    console.log('iM HERE !!!!!!!! '+representative)
  let voteRecord = db.VoteRecord()
  let bills = db.Bill()
  let billClassification = db.BillClassification()

  let finalArray =[]
  let test = []
  let repId = ""
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
        votes.where('member','==',repId).innerJoin('vote',voteRecord,'_id').then(result=>{
          result.forEach(element => {
            test.push(element)
          })
          if(result){
            bills.innerJoin('_id',billClassification,'bill').then( billTable=>{
              for(let i= 0; i<result.length; i++){
                for(let j= 0; j<billTable.length; j++){

                  if(result[i].bill == billTable[j].bill){
                    let temp = {voteRecord: result[i],billData: billTable[j]}
                    console.log(temp)
                    finalArray.push(temp)
                  }
                }}
              res.json({
                success: true,
                data: finalArray
              })
            })}

        })

      })
}
//getAllBillsBySponsorName

exports.getAllBillsBySponsorName = (req, res) =>  {
  console.log('getAllBillsBySponsorName endpoint was successfully callled')
  let records = []
  const db = new Firestore()
  let voteRecord = db.VoteRecord()
  let billClassification = db.BillClassification()
  let votes = db.Vote()
  let sponsor = req.params.head.toLowerCase()
  console.log('iM HERE !!!!!!!! '+sponsor)


  let billsWithClassification = []
  let billsTotalVotes = []
  let finalArray =[]
  let data1 = []
  // db.Bill().select('sponsorName','==',sponsor).then(snapshot=>{
  //   if (snapshot.empty) {
  //     res.status(400).json({
  //       message: 'Rep Not Found',
  //       success: false
  //     })
  //   }
  //   snapshot.forEach(doc => {
  //     data1.push(doc.data)
  //   })
  //   res.json({
  //     success: true,
  //     data: data1
  // })

  // })
  db.Bill().where('sponsorName','==',sponsor).innerJoin('_id',billClassification,'bill').then(result=>{
    if (result.empty) {
      res.status(400).json({
        message: 'Rep Not Found',
        success: false
      })
    }
    result.forEach(doc => {
      data1.push(doc)
    })
    res.json({
      success: true,
      data: data1
    })

  })

  //   result.forEach(bill=>{
  //     billsWithClassification.push(bill)
  //   })
  //
  //     db.Bill().where('sponsorName','==',sponsor).innerJoin('_id',voteRecord,'bill').then(data => {
  //         data.forEach(bill=>{
  //           billsTotalVotes.push(bill)
  //       })
  //
  //       if(billClassification.length != 0 && billsTotalVotes.length !=0 ){
  //         for(let i= 0; i<billsWithClassification.length; i++){
  //
  //           for(let j= 0; j<billsTotalVotes.length; j++){
  //
  //             if(billsWithClassification[i].bill == billsTotalVotes[j].bill){
  //               let temp = {billsClassified: billsWithClassification[i],voteRecord: billsTotalVotes[j]}
  //               console.log("temp is " +temp)
  //               finalArray.push(temp)
  //             }
  //           }}
  //
  //         res.json({
  //           success: true,
  //           data: finalArray
  //         })
  //       }
  //
  //
  //
  //     })
  //
  //
  // })

}