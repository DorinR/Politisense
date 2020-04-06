const Firestore = require('@firestore').Firestore
const ExpenditureComputeAction = require('@action').ExpenditureComputeAction
const Utils = require('./util/ActivityVotingUtils')


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

function fetchMemberExpenditures(member, parliament = 43, year = 2019) {
  return new ExpenditureComputeAction({
    parliament: parliament,
    year: year,
    member: member
  })
    .perform()
    .then(results => {
      return results
        .filter(result => { return result.parent === '' })
        .map(doc => { return doc.amount })
    })
    .catch(console.error)
}

exports.pastMemberExpenditures = async (req, res) => {
  const ParliamentToYears = {
    40: [2012],
    41: [2013, 2014],
    42: [2015, 2016, 2017, 2018],
    43: [2019]
  }
  const parliament = req.body.parliament
  const years = ParliamentToYears[`${parliament}`]
  Promise.all(
    years.map(year => {
      return fetchMemberExpenditures(req.params.member, parliament, year)
    })
  )
    .then(expenditures => {
      return expenditures.map(expenditure => {
        return expenditure.reduce((a, b) => { return a + b })
      })
    })
    .then(data => {
      Utils.success(res, 'expenditures retreived', data)
    })
    .catch(e => {
      console.log(e)
      Utils.error(res, 500, 'unspecified server error')
    })
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
