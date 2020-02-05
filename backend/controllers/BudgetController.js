const Firestore = require('@firestore').Firestore
// =========== AVG OFFICE COSTS ============
async function fetchAverageOfficeSpending () {
  const db = new Firestore()
  const officeSpendingItems = []

  await db
    .FinancialRecord()
    .where('parent', '==', '8-Offices')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        officeSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return officeSpendingItems
}

function computeAverageOfficeSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return (total / spendingItems.length) * 9
  } else {
    return null
  }
}

// =========== AVG ADVERTISING COSTS ============

async function fetchAverageAdvertisingSpending () {
  const db = new Firestore()
  const advertisingSpendingItems = []

  await db
    .FinancialRecord()
    .where('category', '==', '6-Advertising')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        advertisingSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return advertisingSpendingItems
}

function computeAverageAdvertisingSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return total / spendingItems.length
  } else {
    return null
  }
}

// =========== AVG EMPLOYEE COSTS ============

async function fetchAverageEmployeeSpending () {
  const db = new Firestore()
  const employeeSpendingItems = []

  await db
    .FinancialRecord()
    .where('category', '==', "1-Employees' salaries")
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        employeeSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return employeeSpendingItems
}

function computeAverageEmployeeSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return total / spendingItems.length
  } else {
    return null
  }
}

// =========== AVG GIFTS COSTS ============
async function fetchAverageGiftsSpending () {
  const db = new Firestore()
  const giftsSpendingItems = []

  await db
    .FinancialRecord()
    .where('category', '==', '5-Gifts')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        giftsSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return giftsSpendingItems
}

function computeAverageGiftsSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return total / spendingItems.length
  } else {
    return null
  }
}

// =========== AVG HOSPITALITY COSTS ============

async function fetchAverageHospitalitySpending () {
  const db = new Firestore()
  const hospitalitySpendingItems = []

  await db
    .FinancialRecord()
    .where('category', '==', '4-Hospitality')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        hospitalitySpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return hospitalitySpendingItems
}

function computeAverageHospitalitySpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return total / spendingItems.length
  } else {
    return null
  }
}

// =========== AVG PRINTING COSTS ============
async function fetchAveragePrintingSpending () {
  const db = new Firestore()
  const printingSpendingItems = []

  await db
    .FinancialRecord()
    .where('parent', '==', '7-Printing')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        printingSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return printingSpendingItems
}

function computeAveragePrintingSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return (total / spendingItems.length) * 3
  } else {
    return null
  }
}

// =========== AVG TRAVEL COSTS ============
async function fetchAverageTravelSpending () {
  const db = new Firestore()
  const travelSpendingItems = []

  await db
    .FinancialRecord()
    .where('parent', '==', '3-Travel')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        travelSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return travelSpendingItems
}

function computeAverageTravelSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return (total / spendingItems.length) * 7
  } else {
    return null
  }
}

// =========== MP FULL COSTS ============

// =========== MP OFFICE COSTS ============
async function fetchOfficeSpending (repID) {
  const db = new Firestore()
  const officeSpendingItems = []

  await db
    .FinancialRecord()
    .where('member', '==', repID)
    .where('parent', '==', '8-Offices')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        officeSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return officeSpendingItems
}

function computeTotalOfficeSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP TRAVEL COSTS ============
async function fetchTravelSpending (repID) {
  const db = new Firestore()
  const travelSpendingItems = []

  await db
    .FinancialRecord()
    .where('member', '==', repID)
    .where('parent', '==', '3-Travel')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        travelSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return travelSpendingItems
}

function computeTotalTravelSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP PRINTING COSTS ============
async function fetchPrintingSpending (repID) {
  const db = new Firestore()
  const printingSpendingItems = []

  await db
    .FinancialRecord()
    .where('member', '==', repID)
    .where('parent', '==', '7-Printing')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        printingSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return printingSpendingItems
}

function computeTotalPrintingSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP ADVERTISING COSTS ============
async function fetchAdvertisingSpending (repID) {
  const db = new Firestore()
  const advertisingSpendingItems = []

  await db
    .FinancialRecord()
    .where('member', '==', repID)
    .where('category', '==', '6-Advertising')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        advertisingSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return advertisingSpendingItems
}

function computeTotalAdvertisingSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP EMPLOYEE COSTS ============
async function fetchEmployeeSpending (repID) {
  const db = new Firestore()
  const employeeSpendingItems = []

  await db
    .FinancialRecord()
    .where('member', '==', repID)
    .where('category', '==', "1-Employees' salaries")
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        employeeSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return employeeSpendingItems
}

function computeTotalEmployeeSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP GIFTS COSTS ============
async function fetchGiftsSpending (repID) {
  const db = new Firestore()
  const giftsSpendingItems = []

  await db
    .FinancialRecord()
    .where('member', '==', repID)
    .where('category', '==', '5-Gifts')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        giftsSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return giftsSpendingItems
}

function computeTotalGiftsSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP HOSPITALITY COSTS ============

async function fetchHospitalitySpending (repID) {
  const db = new Firestore()
  const hospitalitySpendingItems = []

  await db
    .FinancialRecord()
    .where('member', '==', repID)
    .where('category', '==', '4-Hospitality')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        hospitalitySpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return hospitalitySpendingItems
}

function computeTotalHospitalitySpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
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

  const rawData = await Promise.all([
    fetchEmployeeSpending(representativeId),
    fetchAdvertisingSpending(representativeId),
    fetchGiftsSpending(representativeId),
    fetchHospitalitySpending(representativeId),
    fetchOfficeSpending(representativeId),
    fetchPrintingSpending(representativeId),
    fetchTravelSpending(representativeId),
    fetchAverageEmployeeSpending(),
    fetchAverageAdvertisingSpending(),
    fetchAverageGiftsSpending(),
    fetchAverageHospitalitySpending(),
    fetchAverageOfficeSpending(),
    fetchAveragePrintingSpending(),
    fetchAverageTravelSpending()
  ])
  const data = {}
  data.mp = []
  data.mp[0] = Math.round(computeTotalEmployeeSpending(rawData[0]))
  data.mp[1] = Math.round(computeTotalAdvertisingSpending(rawData[1]))
  data.mp[2] = Math.round(computeTotalGiftsSpending(rawData[2]))
  data.mp[3] = Math.round(computeTotalHospitalitySpending(rawData[3]))
  data.mp[4] = Math.round(computeTotalOfficeSpending(rawData[4]))
  data.mp[5] = Math.round(computeTotalPrintingSpending(rawData[5]))
  data.mp[6] = Math.round(computeTotalTravelSpending(rawData[6]))

  data.avg = []
  data.avg[0] = Math.round(computeAverageEmployeeSpending(rawData[7]))
  data.avg[1] = Math.round(computeAverageAdvertisingSpending(rawData[8]))
  data.avg[2] = Math.round(computeAverageGiftsSpending(rawData[9]))
  data.avg[3] = Math.round(computeAverageHospitalitySpending(rawData[10]))
  data.avg[4] = Math.round(computeAverageOfficeSpending(rawData[11]))
  data.avg[5] = Math.round(computeAveragePrintingSpending(rawData[12]))
  data.avg[6] = Math.round(computeAverageTravelSpending(rawData[13]))
  res.status(200).json({
    success: true,
    data: data
  })
}
