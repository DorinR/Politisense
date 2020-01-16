import { Firestore } from '../client/src/Firebase'

exports.getBillById = (req, res) => {
  console.log('getBillById endpoint was successfully callled')
}
exports.getAllBillsByHead = (req, res) =>  {
  console.log('getAllBillsByHead endpoint was successfully callled')
  let records = []
  const db = new Firestore()
  let votes = db.Vote()
  let representative = req.params.head.toLowerCase()
  let voteRecord = db.VoteRecord()
  let bills = db.Bill()
  let billClassification = db.BillClassification()
  let votesVoteRecordTable = votes.innerJoin('vote',voteRecord,'_id')
  let billBillsClassificationTable= bills.innerJoin('_id',billClassification,'bill')

  // let politician = db.Politician().where('name','==',representative).then(snapshot =>{
  // })

 let mpBills = []
  let mpVotes = []
  db.Politician()
      .select('name', '==', representative)
      .then(snapshot => {

        if (snapshot.empty) {
          res.status(400).json({
            message: 'Riding Not Found',
            success: false
          })
        }
        let id=''
        snapshot.forEach(doc => {
           id = doc.id
          console.log("IM HERE INSIDE FOR EACH")
        })
        console.log('id is '+id)

        let test =[]
        db.Vote().select('member','==',id).then(snapshot=>{
           if(snapshot){
             snapshot.forEach(doc =>
             console.log(doc.data())
                 test.push(doc.data())
             )}
         })
        console.log('TESTING!!!   '+ test)
        db.VoteRecord().select()
          console.log(test)
        mpBills =  votes.where('member','==',id).innerJoin('vote',voteRecord,'bill')
        console.log('records lenght '+ records.length)
        if(mpBills){
          res.json({
            success: true,
            data: mpBills
          })
        }

      })

  // function getAllBillsByHead(head){
  //   votesVoteRecordTable.forEach(element =>{
  //     if(element.)
  //   })

  }

  // let politician = db.Politician().where('name','==',representative).innerJoin('_id',votes,'member').then(results=>{
  //  records = (results)
  //   console.log("Im inside POLITICAN "+ JSON.stringify(results))
  //   res.json({
  //     success: true,
  //     data: records
  //   })
  //
  // })}

// // Recieved this error db.Politician(...).where(...).innerJoin(...).innerJoin is not a function
//     let politician = db.Politician().where('name','==',representative)
//         .innerJoin('_id',votes,'member')
//         .innerJoin('vote',voteRecord,'_id')
//         .innerJoin('bill',bills,'_id').then(result=>{
//
//             records = (results)
//               console.log("Im inside POLITICAN "+ JSON.stringify(results))
//               res.json({
//                 success: true,
//                 data: records
//               })
//         })





// }







// let bills = db.Bill().where()
// let voteRecords = db.VoteRecord()
// let repId=''
// let records = votes.innerJoin('member')
// db.Politician()
//     .select('name', '==', representative)
//     .then(snapshot => {
//       if (snapshot.empty) {
//         res.status(400).json({
//           message: 'Riding Not Found',
//           success: false
//         })
//       }
//       snapshot.forEach(doc => {
//         repId = doc.id
//
//       })
//     })




//
// let records = await votes.innerJoin('vote',voteRecords,'_id').catch(e=>console.log(e))
// res.json({
//   success: true,
//   data: records
// })
//




