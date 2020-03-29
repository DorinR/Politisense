const Firestore = require("@firestore").Firestore;
const ExpenditureComputeAction = require("@action").ExpenditureComputeAction;

function fetchAverageExpenditures(parliament = 43, year = 2019) {
  return new Firestore()
    .forParliament(parliament)
    .atYear(year)
    .AverageExpenditure()
    .select()
    .then(snapshot => {
      const docs = [];
      snapshot.forEach(doc => {
        docs.push(doc.data());
      });
      return docs
        .filter(doc => {
          return doc.parent === "";
        })
        .map(doc => {
          return doc.amount;
        });
    })
    .catch(console.error);
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
        .filter(result => {
          return result.parent === "";
        })
        .map(doc => {
          return doc.amount;
        });
    })
    .catch(console.error);
}

// =========== MP HOSPITALITY COSTS ============

async function fetchServiceContractsSpending(repID) {
  const db = new Firestore(false).forParliament(43);
  const hospitalitySpendingItems = [];

  await db
    .FinancialPersonalExpenses(2019)
    .where("member", "==", repID)
    .where("category", "==", "2-Service Contracts")
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      snapshot.forEach(doc => {
        hospitalitySpendingItems.push(doc.data());
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
  return hospitalitySpendingItems;
}

function computeServiceContractsSpending(spendingItems) {
  let total = 0;
  spendingItems.forEach(item => {
    total += item.amount;
  });
  return total;
}

exports.budgetData = async (req, res) => {
  const representativeId = req.params.id;
  if (!representativeId) {
    res.status(404).json({
      success: false,
      data: {
        mp: [],
        avg: []
      }
    });
    return;
  }

  const [average, member] = await Promise.all([
    fetchAverageExpenditures(),
    fetchMemberExpenditures(representativeId)
  ]);

  if (member && average) {
    res.status(200).json({
      success: true,
      data: {
        mp: member,
        avg: average
      }
    });
  } else {
    res.status(400).json({
      success: false,
      data: {
        mp: [],
        avg: []
      }
    });
  }
};
