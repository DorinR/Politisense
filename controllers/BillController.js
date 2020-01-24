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