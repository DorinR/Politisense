const Firestore = require('@firestore').Firestore
const ExpenditureComputeAction = require('@action').ExpenditureComputeAction

function fetchAverageExpenditures(parliament = 43, year = 2019) {
  return new Firestore()
    .forParliament(parliament)
    .atYear(year)
    .AverageExpenditure()
    .select()
    .then(snapshot => {
      const docs = []
      snapshot.forEach(doc => {
        docs.push(doc.data())
      })
      return docs
        .filter(doc => { return doc.parent === '' })
        .map(doc => { return doc.amount })
    })
    .catch(console.error)
}

//(member, parliament = 43, year = 2019)

exports.fetchMemberExpenditures = async (req, res) => {
  console.log("from frontend member:", req.params.member)
  console.log("from frontend parliament:", req.body.parliament)
  return new ExpenditureComputeAction({
    parliament: req.body.parliament,
    member: req.params.member
  })
    .perform()
    .then(results => {
      return results
        .filter(result => { return result.parent === '' })
        .map(doc => { return doc.amount })
    })
    .catch(console.error)
}

exports.budgetData = async (req, res) => {
  const representativeId = req.params.id
  if (!representativeId) {
    res.status(404).json({
      success: false,
      data: {
        mp: [],
        avg: []
      }
    })
    return
  }

  const [average, member] = await Promise.all([
    fetchAverageExpenditures(),
    fetchMemberExpenditures(representativeId)
  ])

  if (member && average) {
    res.status(200).json({
      success: true,
      data: {
        mp: member,
        avg: average
      }
    })
  } else {
    res.status(400).json({
      success: false,
      data: {
        mp: [],
        avg: []
      }
    })
  }
}
