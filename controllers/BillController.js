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
  let voteEntries = []
  let voteRecordEntries = []
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
        db.Vote()
            .select('member', '==', repId)
            .then(snapshot => {
              if (snapshot.empty) {
                res.status(400).json({
                  message: 'Riding Not Found',
                  success: false
                })
              }
              snapshot.forEach(doc => {
                voteEntries.push(doc.data())
              })
              db.VoteRecord().select().then(snapshot => {
                snapshot.forEach(doc => {
                  let temp = {docId: doc.id, data: doc.data()}
                  voteRecordEntries.push(temp)
                })
                for(let i = 0 ; i < voteEntries.length;i++){
                  for(let j = 0 ; j < voteRecordEntries.length;j++){
                    if(voteEntries[i].vote === voteRecordEntries[j].docId){
                      voteEntries[i].billId = voteRecordEntries[j].data.bill
                      voteEntries[i].yeas = voteRecordEntries[j].data.yeas
                      voteEntries[i].nays = voteRecordEntries[j].data.nays
                    }
                  }
                }
                let bills = db.Bill()
                let billClassif = db.BillClassification()
                let records = bills.innerJoin('_id',billClassif,'bill').then(result =>{
                  for(let i = 0 ; i < voteEntries.length;i++){
                    for(let j = 0 ; j < result.length;j++){
                      if(voteEntries[i].billId === result[j].bill){
                        voteEntries[i].billInfo = result[j]
                      }
                    }
                  }
                  res.json({
                    success: true,
                    data: voteEntries
                  })
                })
              })
            })
      })
}
