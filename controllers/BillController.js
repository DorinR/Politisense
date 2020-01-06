import {Firestore} from "../client/src/Firebase";

exports.getBillById = (req, res) => {
  console.log('getBillById endpoint was successfully callled')
}

exports.getBillsBySponsor = (req, res) => {
  const sponsor = req.body.sponsor
  let bills = []
          // res.json({
          //   success: true,
          //   data: sponsor
          // })
  const db = new Firestore()
  db.Bill()
      .select('sponsorName', '==', sponsor)
      .then(snapshot => {
        if (snapshot.empty) {
          res.json({
            success: false,
            data: 'No bills found for that sponsor'
          })
        }
        snapshot.forEach(doc => {
          bills.push(doc.data())
        })
        res.json({
          success: true,
          data: bills
        })
      })
      .catch(err => {
        console.error('Error getting documents', err)
      })
}

exports.filterBillsByCategory = (req, res) => {
  res.json({
    success: false,
    data: 'No bills found for that sponsor'
  })
}
