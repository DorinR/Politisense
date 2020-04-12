const Firestore = require('@firestore').Firestore
const ExpenditureComputeAction = require('@action').ExpenditureComputeAction

function fetchAverageExpenditures (parliament = 43, year = 2019) {
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
<<<<<<< Updated upstream
        .filter(doc => {
          return doc.parent === ''
        })
        .sort((a, b) => {
          if (a.category < b.category) return -1
          if (a.category > b.category) return 1
          return 0
        })
        .map(doc => {
          return { amount: Math.round(doc.amount), category: (doc.category).substr(2) }
        })
=======
        .filter(doc => { return doc.parent === '' })
        .map(doc => { return doc.amount })
>>>>>>> Stashed changes
    })
    .catch(console.error)
}

function fetchMemberExpenditures (member, parliament = 43, year = 2019) {
  return new ExpenditureComputeAction({
    parliament: parliament,
    year: year,
    member: member
  })
    .perform()
    .then(results => {
      return results
<<<<<<< Updated upstream
        .filter(result => {
          return result.parent === ''
        })
        .map(doc => {
          return Math.round(doc.amount)
        })
=======
        .filter(result => { return result.parent === '' })
        .map(doc => { return doc.amount })
>>>>>>> Stashed changes
    })
    .catch(console.error)
}

exports.budgetData = async (req, res) => {
  const representativeId = req.params.id
  if (!representativeId) {
    res.status(404).json({
<<<<<<< Updated upstream
      success: false,
      data: {
        mp: [],
        avg: [],
        labels: []
      }
    })
    return
  }
  const [average, member] = await Promise.all([
    fetchAverageExpenditures(),
    fetchMemberExpenditures(representativeId)
  ])

  if (member && average) {
    const labels = average.map(item => {
      if (item.category.includes('Employees')) {
        return item.category.substr(0, 9)
      }
      return item.category
    })
    const avgCategoriesValues = average.map(item => item.amount)
    res.status(200).json({
      success: true,
      data: {
        mp: member,
        avg: avgCategoriesValues,
        labels: labels
      }
    })
  } else {
    res.status(400).json({
=======
>>>>>>> Stashed changes
      success: false,
      data: {
        mp: [],
        avg: [],
        labels: []
      }
    })
  }
<<<<<<< Updated upstream
=======

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
>>>>>>> Stashed changes
}
