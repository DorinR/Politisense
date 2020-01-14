import {Firestore} from "../client/src/Firebase";

exports.getBillById = (req, res) => {
  console.log('getBillById endpoint was successfully callled')
}

// exports.getBillsByCategoryForRep = async (req, res) => {
//   const db = new Firestore()
//   let politicians = db.Politician()
//   let votes = db.Vote()
//   let records = await votes.innerJoin('member', politicians, '_id')
//           res.json({
//             success: true,
//             data: records
//           })


  // db.Vote()
  //     .innerJoin('member', politicians, '_id')
  //     .then(snapshot => {
  //       if (snapshot.empty) {
  //         res.status(400).json({
  //           message: 'Riding Not Found',
  //           success: false
  //         })
  //       }
  //       snapshot.forEach(doc => {
  //         res.json({
  //           success: true,
  //           data: doc.data()
  //         })
  //       })
  //     })
//}


exports.getBillsByCategoryForRep = async (req, res) => {
  const db = new Firestore()
  let representative = req.body.representative
  let cateogry  = req.body.category
  let bills = db.Bill()
  let votes = db.Vote()
  let voteRecords = db.VoteRecord()
  let records = await votes.innerJoin('vote',voteRecords,'_id').catch(e=>console.log(e))
  res.json({
    success: true,
    data: records
  })

  //let records2 = await records.innerJoin('bill',bills,'_id')
  //let repId = ""
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
  //       })
  //     })




  // db.Politician()
  //     .select('name', '==', representative)
  //     .then(snapshot => {
  //       if (snapshot.empty) {
  //         res.status(400).json({
  //           message: 'Rep Not Found',
  //           success: false
  //         })
  //       }
  //       snapshot.forEach(doc => {
  //         repId = doc.id
  //       })
  //       db.Vote()
  //           .select('member', '==', repId)
  //           .then(snapshot => {
  //             if (snapshot.empty) {
  //               res.status(400).json({
  //                 message: 'Riding Not Found',
  //                 success: false
  //               })
  //             }
  //             snapshot.forEach(doc => {
  //               voteEntries.push(doc.data())
  //             })
  //             let bills = db.Bill()
  //             let records =  bills.innerJoin('_id',)
  //           })
  //     })
}
