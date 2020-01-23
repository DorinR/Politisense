import { Firestore } from '../client/src/Firebase'

exports.getAllBills = async (req, res) => {
  console.log('getAllBills endpoint called!')
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
