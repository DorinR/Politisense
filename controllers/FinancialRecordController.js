import { Firestore } from '../client/src/Firebase'

exports.getAllSpendingItemsForParty = (req, res) => {
  console.log('getAllSpendingItems endpoint hit!')
  console.log(`argument recevied: ${req.params.party}`)
  const desiredCategories = [
    "1-Employees' salaries",
    '2-Service Contracts',
    '3-Travel',
    '4-Hospitality',
    '5-Gifts',
    '6-Advertising'
  ]
  const db = new Firestore()
  const financialRecordCollection = db.FinancialRecord()
  db.Politician()
    .where('politicalParty', '==', req.params.party)
    .innerJoin('_id', financialRecordCollection, 'member')
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).json({
          success: false,
          message: 'No Financial Records Found'
        })
      } else {
        const allSpendingItems = []
        snapshot.forEach(item => {
          let { amount, category, parent } = item
          if (parent === '3-Travel') {
            category = parent
          }
          if (desiredCategories.includes(category)) {
            allSpendingItems.push({
              amount,
              category
            })
          }
        })
        res.status(200).json({
          success: true,
          data: allSpendingItems
        })
      }
    })
}
