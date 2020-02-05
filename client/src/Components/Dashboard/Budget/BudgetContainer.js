import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListItemText from '@material-ui/core/ListItemText'
import Box from '@material-ui/core/Box'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import BarChartWrapper from '../Charts/Wrappers/BarChartWrapper'
const Firestore = require('../../../Firebase').Firestore

export async function fetchUserRiding (userEmail) {
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

export async function fetchRepresentative (riding) {
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

export async function fetchRepresentativeId (representative) {
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

export async function fetchAverageOfficeSpending () {
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

export function computeAverageOfficeSpending (spendingItems) {
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

export async function fetchAverageAdvertisingSpending () {
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

export function computeAverageAdvertisingSpending (spendingItems) {
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

export async function fetchAverageEmployeeSpending () {
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

export function computeAverageEmployeeSpending (spendingItems) {
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

export async function fetchAverageGiftsSpending () {
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

export function computeAverageGiftsSpending (spendingItems) {
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

export async function fetchAverageHospitalitySpending () {
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

export function computeAverageHospitalitySpending (spendingItems) {
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
export async function fetchAveragePrintingSpending () {
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

export function computeAveragePrintingSpending (spendingItems) {
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
export async function fetchAverageTravelSpending () {
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

export function computeAverageTravelSpending (spendingItems) {
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
export async function fetchOfficeSpending (repID) {
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

export function computeTotalOfficeSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP TRAVEL COSTS ============
export async function fetchTravelSpending (repID) {
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

export function computeTotalTravelSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP PRINTING COSTS ============
export async function fetchPrintingSpending (repID) {
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

export function computeTotalPrintingSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP ADVERTISING COSTS ============
export async function fetchAdvertisingSpending (repID) {
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

export function computeTotalAdvertisingSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP EMPLOYEE COSTS ============
export async function fetchEmployeeSpending (repID) {
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

export function computeTotalEmployeeSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP GIFTS COSTS ============
export async function fetchGiftsSpending (repID) {
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

export function computeTotalGiftsSpending (spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP HOSPITALITY COSTS ============

export async function fetchHospitalitySpending (repID) {
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

export function computeTotalHospitalitySpending (spendingItems) {
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
  }
})

export default function BudgetContainer () {
  const classes = useStyles()
  // budget data
  const [budgetData, setBudgetData] = useState([])

  useEffect(() => {
    async function getData () {
      const mp = {
        label: '',
        values: []
      }
      const avg = {
        label: 'Average Among MPs',
        values: []
      }
      /* eslint-disable */
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        // boilerplate data fetching
        const { email } = user
        const riding = await fetchUserRiding(email)
        const representative = await fetchRepresentative(riding)
        mp.label = representative
        const representativeId = await fetchRepresentativeId(representative)

        // per MP items
        let employeeSpendingItems = []
        let advertisingSpendingItems = []
        let giftsSpendingItems = []
        let hospitalitySpendingItems = []
        let officeSpendingItems = []
        let printingSpendingItems = []
        let travelSpendingItems = []

        //average of all MPs
        let avgEmployeeSpendingItems = []
        let avgAdvertisingSpendingItems = []
        let avgGiftsSpendingItems = []
        let avgHospitalitySpendingItems = []
        let avgOfficeSpendingItems = []
        let avgPrintingSpendingItems = []
        let avgTravelSpendingItems = []

        if (representativeId) {
          // MPs
          employeeSpendingItems = await fetchEmployeeSpending(representativeId)
          advertisingSpendingItems = await fetchAdvertisingSpending(
            representativeId
          )
          giftsSpendingItems = await fetchGiftsSpending(representativeId)
          hospitalitySpendingItems = await fetchHospitalitySpending(
            representativeId
          )
          officeSpendingItems = await fetchOfficeSpending(representativeId)
          printingSpendingItems = await fetchPrintingSpending(representativeId)
          travelSpendingItems = await fetchTravelSpending(representativeId)

          //Average
          avgEmployeeSpendingItems = await fetchAverageEmployeeSpending()
          avgAdvertisingSpendingItems = await fetchAverageAdvertisingSpending()
          avgGiftsSpendingItems = await fetchAverageGiftsSpending()
          avgHospitalitySpendingItems = await fetchAverageHospitalitySpending()
          avgOfficeSpendingItems = await fetchAverageOfficeSpending()
          avgPrintingSpendingItems = await fetchAveragePrintingSpending()
          avgTravelSpendingItems = await fetchAverageTravelSpending()
        }

        // MPs
        let totalEmployees = computeTotalEmployeeSpending(employeeSpendingItems)
        let ads = computeTotalAdvertisingSpending(advertisingSpendingItems)
        let gifts = computeTotalGiftsSpending(giftsSpendingItems)
        let hospitality = computeTotalHospitalitySpending(
          hospitalitySpendingItems
        )
        let office = computeTotalOfficeSpending(officeSpendingItems)
        let printing = computeTotalPrintingSpending(printingSpendingItems)
        let travel = computeTotalTravelSpending(travelSpendingItems)

        mp.values[0] = Math.round(totalEmployees)
        mp.values[1] = Math.round(ads)
        mp.values[2] = Math.round(gifts)
        mp.values[3] = Math.round(hospitality)
        mp.values[4] = Math.round(office)
        mp.values[5] = Math.round(printing)
        mp.values[6] = Math.round(travel)

        //Average
        let avgEmp = computeAverageEmployeeSpending(avgEmployeeSpendingItems)
        let avgAds = computeAverageAdvertisingSpending(
          avgAdvertisingSpendingItems
        )
        let avgGifts = computeAverageGiftsSpending(avgGiftsSpendingItems)
        let avgHosp = computeAverageHospitalitySpending(
          avgHospitalitySpendingItems
        )
        let avgOffice = computeAverageOfficeSpending(avgOfficeSpendingItems)
        let avgPrint = computeAveragePrintingSpending(avgPrintingSpendingItems)
        let avgTravel = computeAverageTravelSpending(avgTravelSpendingItems)

        avg.values[0] = Math.round(avgEmp)
        avg.values[1] = Math.round(avgAds)
        avg.values[2] = Math.round(avgGifts)
        avg.values[3] = Math.round(avgHosp)
        avg.values[4] = Math.round(avgOffice)
        avg.values[5] = Math.round(avgPrint)
        avg.values[6] = Math.round(avgTravel)
      }
      setBudgetData([mp, avg])
    }
    getData()
  }, [budgetData])

  return (
    <div className={classes.container}>
      <ListItemText>
        {budgetData.length == 0 ? (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
            <CircularProgress />
          </div>
        ) : (
          <BarChartWrapper type={'budget'} data={budgetData} />
        )}

        <Box m={1} />
      </ListItemText>
    </div>
  )
}
