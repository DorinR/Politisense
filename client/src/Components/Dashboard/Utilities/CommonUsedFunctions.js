import axios from 'axios'
import { useEffect, useRef } from 'react'

export async function fetchCategoriesFromTxtFiles() {
  return axios.get('/api/bills/fetchCategoriesFromTxtFiles').then((res) => {
    if (res.data.success) {
      return res.data.data
    }
  })
}

export async function checkUserExists(email) {
  return axios.post('/api/users/checkIfUserExists', { email: email })
}

export function mergeArrays(rawData) {
  let jointArray = []

  rawData.forEach((array) => {
    if (array) {
      jointArray = [...jointArray, ...array]
    }
  })
  const mergedArrays = [...new Set([...jointArray])]
  return mergedArrays
}

export function formattingCategory(element) {
  if (element.includes('-')) {
    return capitalizedName(element.replace('-', ' '))
  }
  return capitalizedName(element)
}

export function capitalizedName(sponsor) {
  if (sponsor && isNaN(sponsor)) {
    let name = sponsor
    name = name
      .toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
    return name
  }
  return null
}

export function getPercentagePartisanIndex(element, arr) {
  // Utility function to compute percentage.
  let sum = 0
  arr.forEach((element) => {
    sum = sum + element.freq
  })
  const fraction = ((element.freq / sum) * 100).toFixed(1)
  return fraction
}

export function loadingTextTitle(element) {
  let title = null
  switch (element.type) {
    case 'parliamentary':
      title = element.title
      break
    case 'association':// eslint-disable-next-line no-lone-blocks
      {
        if (element.group.includes('inter-')) {
          title = element.group.slice(0, element.group.indexOf('inter-'))
        } else {
          title = element.group.slice(
            0,
            element.group.indexOf('parliamentary')
          )
        }
      }
      break
    case 'committee':
      title = element.group
      break
    default:
      title = ''
      break
  }

  return title
}

export function loadingTextdata(element) {
  if (element.fromDate === 0 && element.toDate === 0) {
    return 'Present'
  }
  if (element.fromDate !== 0 && element.toDate === 0) {
    return `${element.fromDate} - Present`
  }
  if (element.fromDate !== 0 && element.toDate !== 0) {
    return `${element.fromDate} - ${element.toDate}`
  }
}

export function checkIsEmptyRawData(arrs) {
  let counter = 0
  arrs.forEach((arr) => {
    if (arr.length !== 0 && arr !== null) {
      counter = counter + arr.length
    }
  })
  if (counter !== 0) {
    return true
  } else {
    return false
  }
}

export function mergeArraysAndFilteringByType(type, ...arrays) {
  let jointArray = []

  arrays.forEach((array) => {
    jointArray = [...jointArray, ...array]
  })
  const mergedArrays = [...new Set([...jointArray])]

  const uniqueElements = mergedArrays.filter(
    (thing, index, self) =>
      index ===
      self.findIndex(
        (element) =>
          element.title === thing.title &&
          element.group === thing.group &&
          element.toDate === thing.toDate &&
          element.fromDate === thing.fromDate
      )
  )

  if (uniqueElements.length === 0) {
    return null
  }
  if (type === 'role') {
    return uniqueElements.filter((item) => item.group === 'none')
  }
  if (type === 'committee') {
    return uniqueElements.filter((item) => item.type === 'committee')
  }
  if (type === 'association') {
    return uniqueElements.filter((item) => item.group.includes('association'))
  }
}

export async function getAllRolesByRep(type, repName) {
  return axios
    .get(`/api/representatives/${repName}/getAllRolesByRep`)
    .then((res) => {
      if (res.data.success) {
        const data = res.data.data
        const arrays = []
        data.forEach((arr) => arrays.push(arr))
        const mpRoles = mergeArraysAndFilteringByType(type, ...arrays)
        const mpRolesSorted = sortingBasedOnDate(mpRoles)
        return mpRolesSorted
      }
    })
    .catch(console.error)
}

export async function getAllDesc(arr) {
  for (const element of arr) {
    element.desc = await getDescription(titleCase(loadingTextTitle(element)))
  }
  return arr
}

export function sortingBasedOnDate(arr) {
  arr.sort((a, b) => {
    if (a.fromDate === 0 || b.fromDate === 0) {
      return -1
    } else {
      if (a.fromDate > b.fromDate) {
        return -1
      } else {
        return 1
      }
    }
  })
  return arr
}

export const getDescription = async (ministry) => {
  return axios
    .post('api/parliament/getRoleDescription', { ministry: ministry })
    .then((res) => {
      let desc = ''
      if (res.data.success) {
        desc = res.data.data.description
      }
      return desc
    })
    .catch(console.error)
}

export function titleCase(str) {
  const regex = /(^|\b(?!(and?|at?|the|for|to|but|by|of)\b))\w+/g
  return str
    .toLowerCase()
    .replace(regex, (s) => s[0].toUpperCase() + s.slice(1))
}

export async function fetchUserRiding(userEmail) {
  return axios
    .get(`/api/users/${userEmail}/getUser`)
    .then((res) => {
      if (res.data.success) {
        return res.data.data.riding
      }
    })
    .catch(console.error)
}

export async function fetchRidingCode(riding) {
  return axios
    .get(`/api/ridings/getRidingCode/${encodeURI(riding)}`)
    .then((res) => {
      if (res.data.success) {
        return res.data.data.code
      }
    })
    .catch(console.error)
}

export async function fetchRepresentative(riding) {
  return axios
    .get(`/api/representatives/${riding}/getRepresentative`)
    .then((res) => {
      if (res.data.success) {
        console.log(res.data)
        return res.data.data
      }
    })
    .catch(console.error)
}

export function totalBillsArray(arr) {
  const totalBills = arr.filter(
    (thing, index, self) =>
      index ===
      self.findIndex(
        (t) => t.billsClassified.number === thing.billsClassified.number
      )
  )
  return totalBills.length
}

export function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function createVariablesRadar(categories) {
  const lables = []
  categories.forEach((category) => {
    lables.push({ key: category, label: category })
  })
  return lables
}

export function createDataSetRadar(categories, data) {
  const dataArray = []
  let temp = {}
  const dataSetRadar = {}
  let maxValue = 0
  categories.forEach((category) => {
    let totalvotes = 0
    data.forEach((bill) => {
      if (bill.billData.category === category.toLowerCase()) {
        totalvotes++
      }
    })
    const categorySmallLetter = category.toLowerCase().trim()
    temp = { category: categorySmallLetter, value: totalvotes }
    dataArray.push(temp)
  })

  dataArray.forEach((category) => {
    if (category.value > maxValue) {
      maxValue = category.value
    }
    if (category.category) {
      dataSetRadar[category.category] = category.value
    }
  })

  maxValue = roundUpToNearestInteger(maxValue)
  return [dataSetRadar, maxValue]
}
export function getPoliticalPartyFromSponsor(sponsors) {
  const politicalParties = [...new Set(sponsors.map((item) => item.party))]
  return politicalParties
}

export function createPartyCountersForBiPartisanIndex(
  politicalPartiesFromAllParliaments
) {
  const partiesCounters = []
  politicalPartiesFromAllParliaments.forEach((party) => {
    partiesCounters.push({ partyType: party, counter: 0 })
  })
  return partiesCounters
}
export function getBillsForBiPartisanIndex(mpdata, sponsors) {
  const bills = []
  mpdata.forEach((bill) => {
    if (bill.voteRecord.yea === true) {
      sponsors.forEach((sponsor) => {
        if (sponsor.name === bill.billData.sponsorName) {
          if (
            !(
              bills &&
              bills.find(
                (element) =>
                  element.billDetails.billData.number === bill.billData.number
              )
            )
          ) {
            bills.push({ billDetails: bill, category: sponsor.party })
          }
        }
      })
    }
  })
  return bills
}

export function getPartiesDataForBiPartisanIndex(
  mpdata,
  sponsors,
  partiesCounters
) {
  const partiesData = []
  mpdata.forEach((bill) => {
    if (bill.voteRecord.yea === true) {
      sponsors.forEach((sponsor) => {
        if (sponsor.name === bill.billData.sponsorName) {
          partiesCounters.forEach((party) => {
            if (
              sponsor.party === party.partyType &&
              party.partyType !== '' &&
              party.partyType !== undefined
            ) {
              party.counter++
            }
          })
        }
      })
    }
  })
  partiesCounters.forEach((element) => {
    partiesData.push({
      label: element.partyType,
      freq: element.counter,
      value: 0
    })
  })
  return partiesData
}

export function formattingPartiesData(partiesData) {
  partiesData = partiesData.filter(
    (element) =>
      element.label !== undefined && element.label !== '' && element.freq !== 0
  )
  partiesData.forEach((element) => {
    element.label = capitalizedName(element.label)
    element.value = getPercentagePartisanIndex(element, partiesData)
  })
  partiesData = sortBasedOnLargest(partiesData)
  partiesData = AssignColorForEachItem(partiesData)

  return partiesData
}

export function createDataSetDonut(sponsors, mpdata) {
  const politicalPartiesFromAllParliaments = getPoliticalPartyFromSponsor(
    sponsors
  )
  let bills = []
  let partiesData = []
  const partiesCounters = createPartyCountersForBiPartisanIndex(
    politicalPartiesFromAllParliaments
  )
  if (mpdata.length) {
    bills = getBillsForBiPartisanIndex(mpdata, sponsors)
    partiesData = getPartiesDataForBiPartisanIndex(
      mpdata,
      sponsors,
      partiesCounters
    )
  }
  partiesData = formattingPartiesData(partiesData)
  return [partiesData, bills]
}

export function createDataPieBarTable(categories, data) {
  const billsForSpecificCategory = []
  categories.forEach((category) => {
    data.forEach((bill) => {
      if (bill.billsClassified.category === category.toLowerCase()) {
        pushToArrayUniqueBillsForPieBar(
          billsForSpecificCategory,
          bill,
          category
        )
      }
    })
  })

  return billsForSpecificCategory
}
export function sortBasedOnLargest(list) {
  return list.sort(function (a, b) {
    return a.value - b.value
  })
}
export function AssignColorForEachItem(list) {
  const colors = [
    '#32afa9',
    '#556fb5',
    '#00818a',
    '#293462',
    '#7189bf',
    '#d45079'
  ]

  list.forEach((item, index) => {
    item.color = colors[index]
  })
  return list
}

export function roundUpToNearestInteger(num) {
  if (num % 10 === 0) return num + 5
  return 10 - (num % 10) + num
}

export function pushToArrayUniqueBillsForPieBar(arr, obj, category) {
  if (arr.length !== 0) {
    const index = arr.findIndex(
      (e) => e.bill.billsClassified.number === obj.billsClassified.number
    )
    if (index === -1) {
      if (obj.voteRecord.yeas > obj.voteRecord.nays) {
        arr.push({ bill: obj, category: [category], status: 'Passed' })
      } else {
        arr.push({ bill: obj, category: [category], status: 'Failed' })
      }
    } else {
      const currentCategoryList = arr[index].category
      const modifiedCategoryList = currentCategoryList.concat([category])
      const uniqueCategoryList = [...new Set(modifiedCategoryList)]
      arr[index].category = uniqueCategoryList
    }
  } else {
    if (obj.voteRecord.yeas > obj.voteRecord.nays) {
      arr.push({ bill: obj, category: [category], status: 'Passed' })
    } else {
      arr.push({ bill: obj, category: [category], status: 'Failed' })
    }
  }
}
export function pushToArrayUniqueBillsForRadar(arr, obj, category) {
  if (arr.length !== 0) {
    const index = arr.findIndex(
      (e) => e.bill.billData.number === obj.billData.number
    )
    if (index === -1) {
      if (obj.voteRecord.yea) {
        arr.push({ bill: obj, category: [category], status: 'Yea' })
      } else {
        arr.push({ bill: obj, category: [category], status: 'Nay' })
      }
    } else {
      const currentCategoryList = arr[index].category
      const modifiedCategoryList = currentCategoryList.concat([category])
      const uniqueCategoryList = [...new Set(modifiedCategoryList)]

      arr[index].category = uniqueCategoryList
    }
  } else {
    if (obj.voteRecord.yea) {
      arr.push({ bill: obj, category: [category], status: 'Yea' })
    } else {
      arr.push({ bill: obj, category: [category], status: 'Nay' })
    }
  }
}

export function createRadarRows(bills, categoryList) {
  const rows = []
  categoryList.forEach((category) => {
    bills.forEach((bill) => {
      if (bill.billData.category === category.toLowerCase()) {
        pushToArrayUniqueBillsForRadar(rows, bill, category)
      }
    })
  })
  return rows
}

export async function fetchRepresentativeId(representative) {
  return axios
    .get(`/api/representatives/${representative}/getRepresentativeId`)
    .then((res) => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

export function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
