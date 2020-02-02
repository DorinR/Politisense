import React, { useEffect, useState } from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import Box from '@material-ui/core/Box'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import BarChartWrapper from '../Charts/Wrappers/BarChartWrapper'

<<<<<<< HEAD:client/src/Components/Dashboard/Budget/BudgetContainer.js
export default function BudgetContainer () {
  const [user, setUser] = useState(null)
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const usr = JSON.parse(localStorage.getItem('user'))
    setUser(usr)
  }, [])
=======
const Firestore = require('../../../backend/firebase/Firestore').Firestore

export async function fetchUserRiding(userEmail) {
  let result = ''
  await axios
    .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
    .then(res => {
      if (res.data.success) {
        const riding = res.data.data.riding
        result = riding
      }
    })
    .catch(err => console.error(err))
  return result
}

export async function fetchRepresentative(riding) {
  let result = ''
  await axios
    .get(
      `http://localhost:5000/api/representatives/${riding}/getRepresentative`
    )
    .then(res => {
      if (res.data.success) {
        const representative = res.data.data.name
        result = representative
      }
    })
    .catch(err => console.error(err))
  return result
}

export async function fetchRepresentativeId(representative) {
  return axios
    .get(
      `http://localhost:5000/api/representatives/${representative}/getRepresentativeId`
    )
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

// =========== AVG OFFICE COSTS ============

export async function fetchAverageOfficeSpending() {
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

export function computeAverageOfficeSpending(spendingItems) {
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

export async function fetchAverageAdvertisingSpending() {
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

export function computeAverageAdvertisingSpending(spendingItems) {
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

export async function fetchAverageEmployeeSpending() {
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

export function computeAverageEmployeeSpending(spendingItems) {
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

export async function fetchAverageGiftsSpending() {
  const db = new Firestore()
  const giftsSpendingItems = []
>>>>>>> #211 [feature/scraper-refactor] : refactored backend to be easier to traverse:client/src/component/dashboard/Budget/BudgetContainer.js

  const [riding, setRiding] = useState(null)
  useEffect(() => {
    async function getData () {
      if (user) {
        const riding = await fetchUserRiding(user.email)
        setRiding(riding)
      }
    }
    getData()
  }, [user])

  async function fetchUserRiding (userEmail) {
    return axios
      .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
      .then(res => {
        if (res.data.success) {
          return res.data.data.riding
        }
      })
<<<<<<< HEAD:client/src/Components/Dashboard/Budget/BudgetContainer.js
      .catch(console.error)
  }
=======
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return giftsSpendingItems
}

export function computeAverageGiftsSpending(spendingItems) {
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

export async function fetchAverageHospitalitySpending() {
  const db = new Firestore()
  const hospitalitySpendingItems = []
>>>>>>> #211 [feature/scraper-refactor] : refactored backend to be easier to traverse:client/src/component/dashboard/Budget/BudgetContainer.js

  const [representative, setRepresentative] = useState(null)
  useEffect(() => {
    async function getData () {
      if (riding) {
        const rep = await fetchRepresentative(riding)
        setRepresentative(rep)
      }
    }
    getData()
  }, [riding])

  async function fetchRepresentative (riding) {
    return axios
      .get(
        `http://localhost:5000/api/representatives/${riding}/getRepresentative`
      )
      .then(res => {
        if (res.data.success) {
          return res.data.data.name
        }
      })
<<<<<<< HEAD:client/src/Components/Dashboard/Budget/BudgetContainer.js
      .catch(console.error)
=======
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return hospitalitySpendingItems
}

export function computeAverageHospitalitySpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return total / spendingItems.length
  } else {
    return null
>>>>>>> #211 [feature/scraper-refactor] : refactored backend to be easier to traverse:client/src/component/dashboard/Budget/BudgetContainer.js
  }

<<<<<<< HEAD:client/src/Components/Dashboard/Budget/BudgetContainer.js
  const [labelMP, setLabelMP] = useState(null)
  useEffect(() => {
    if (representative) {
      setLabelMP(representative)
    }
  }, [representative])
=======
// =========== AVG PRINTING COSTS ============
export async function fetchAveragePrintingSpending() {
  const db = new Firestore()
  const printingSpendingItems = []
>>>>>>> #211 [feature/scraper-refactor] : refactored backend to be easier to traverse:client/src/component/dashboard/Budget/BudgetContainer.js

  const [repID, setRepID] = useState(null)
  useEffect(() => {
    async function getData () {
      if (representative) {
        const id = await fetchRepresentativeId(representative)
        setRepID(id)
      }
    }
    getData()
  }, [representative])

  async function fetchRepresentativeId (representative) {
    return axios
      .get(
        `http://localhost:5000/api/representatives/${representative}/getRepresentativeId`
      )
      .then(res => {
        if (res.data.success) {
          return res.data.data
        }
      })
<<<<<<< HEAD:client/src/Components/Dashboard/Budget/BudgetContainer.js
      .catch(console.error)
=======
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return printingSpendingItems
}

export function computeAveragePrintingSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return (total / spendingItems.length) * 3
  } else {
    return null
>>>>>>> #211 [feature/scraper-refactor] : refactored backend to be easier to traverse:client/src/component/dashboard/Budget/BudgetContainer.js
  }

<<<<<<< HEAD:client/src/Components/Dashboard/Budget/BudgetContainer.js
  const [data, setData] = useState(null)
  useEffect(() => {
    async function getData () {
      if (repID) {
        const data = await getBudgetData(repID)
        setData(data)
=======
// =========== AVG TRAVEL COSTS ============
export async function fetchAverageTravelSpending() {
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

export function computeAverageTravelSpending(spendingItems) {
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
export async function fetchOfficeSpending(repID) {
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

export function computeTotalOfficeSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP TRAVEL COSTS ============
export async function fetchTravelSpending(repID) {
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

export function computeTotalTravelSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP PRINTING COSTS ============
export async function fetchPrintingSpending(repID) {
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

export function computeTotalPrintingSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP ADVERTISING COSTS ============
export async function fetchAdvertisingSpending(repID) {
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

export function computeTotalAdvertisingSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP EMPLOYEE COSTS ============
export async function fetchEmployeeSpending(repID) {
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

export function computeTotalEmployeeSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP GIFTS COSTS ============
export async function fetchGiftsSpending(repID) {
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

export function computeTotalGiftsSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP HOSPITALITY COSTS ============

export async function fetchHospitalitySpending(repID) {
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
>>>>>>> #211 [feature/scraper-refactor] : refactored backend to be easier to traverse:client/src/component/dashboard/Budget/BudgetContainer.js
      }
    }
    getData()
  }, [repID])

  async function getBudgetData (id) {
    return axios
      .get(
        `http://localhost:5000/api/budgets/budget/${id}`
      )
      .then(res => {
        return res.data.data
      })
<<<<<<< HEAD:client/src/Components/Dashboard/Budget/BudgetContainer.js
      .catch(console.error)
=======
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return hospitalitySpendingItems
}

export function computeTotalHospitalitySpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== AVERAGE FULL COSTS ============

// =========== TOTAL BUDGET COSTS ============

const useStyles = makeStyles({
  container: {
    margin: '20px',
    marginTop: '30px'
>>>>>>> #211 [feature/scraper-refactor] : refactored backend to be easier to traverse:client/src/component/dashboard/Budget/BudgetContainer.js
  }

<<<<<<< HEAD:client/src/Components/Dashboard/Budget/BudgetContainer.js
=======
export default function BudgetContainer() {
  const classes = useStyles()
  // budget data
>>>>>>> #211 [feature/scraper-refactor] : refactored backend to be easier to traverse:client/src/component/dashboard/Budget/BudgetContainer.js
  const [budgetData, setBudgetData] = useState([])
  useEffect(() => {
<<<<<<< HEAD:client/src/Components/Dashboard/Budget/BudgetContainer.js
    if (data) {
      const mps = {
        label: labelMP,
        values: data.mp
=======
    async function getData() {
      const mp = {
        label: '',
        values: []
>>>>>>> #211 [feature/scraper-refactor] : refactored backend to be easier to traverse:client/src/component/dashboard/Budget/BudgetContainer.js
      }
      const avgs = {
        label: 'Average Among MPs',
        values: data.avg
      }
      console.log(data)
      setBudgetData([mps, avgs])
    }
  }, [data, labelMP])

  /* eslint-disable */
  return (
    <ListItemText>
      {budgetData.length === 0 ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <CircularProgress />
        </div>
      ) :

        <BarChartWrapper type={'budget'} data={budgetData} />

      }

      <Box m={1} />
    </ListItemText>
  );
}
