import axios from 'axios'

export async function fetchCategories () {
  return axios
    .get('/api/bills/fetchCategories')
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
}

export function mergeArrays (rawData) {
  let jointArray = []

  rawData.forEach(array => {
    if (array) {
      jointArray = [...jointArray, ...array]
    }
  })
  const mergedArrays = [...new Set([...jointArray])]
  return mergedArrays
}

export function formattingCategory (element) {
  if (element.includes('-')) {
    return capitalizedName(element.replace('-', ' '))
  }
  return capitalizedName(element)
}

export function capitalizedName (sponsor) {
  if (sponsor && isNaN(sponsor)) {
    let name = sponsor
    name = name.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
    return name
  }
  return null
}

export function getPercentagePartisanIndex (element, arr) { // Utility function to compute percentage.
  let sum = 0
  arr.forEach(element => {
    sum = sum + element.freq
  })
  const fraction = ((element.freq / sum) * 100).toFixed(1)
  return fraction
}

export function loadingTextTitle (element) {
  let title = null
  switch (element.type) {
    case 'parliamentary':
      title = element.title
      break
    case 'association':
      title = element.group.slice(0, element.title.indexOf('parliamentary'))
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

export function loadingTextdata (element) {
  if (element.fromDate === 0 && element.toDate === 0) {
    return 'Present'
  }
  if (element.fromDate !== 0 && (element.toDate === 0)) {
    return `${element.fromDate} - Present`
  }
  if (element.fromDate !== 0 && (element.toDate !== 0)) {
    return `${element.fromDate} - ${element.toDate}`
  }
}

export function checkIsEmptyRawData (arrs) {
  let counter = 0
  arrs.forEach(arr => {
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

export function mergeArraysAndFilteringByType (type, ...arrays) {
  let jointArray = []

  arrays.forEach(array => {
    jointArray = [...jointArray, ...array]
  })
  const mergedArrays = [...new Set([...jointArray])]

  const uniqueElements = mergedArrays.filter((thing, index, self) =>
    index === self.findIndex((element) => (
      element.title === thing.title && element.group === thing.group && element.toDate === thing.toDate && element.fromDate === thing.fromDate
    ))
  )

  if (uniqueElements.length === 0) {
    return null
  }
  if (type === 'role') {
    return uniqueElements.filter(item => item.group === 'none')
  }
  if (type === 'committee') {
    return uniqueElements.filter(item => item.type === 'committee')
  }
  if (type === 'association') {
    return uniqueElements.filter(item => item.group.includes('association'))
  }
}

export async function getAllRolesByRep (type, repName) {
  return axios
    .get(`/api/representatives/${repName}/getAllRolesByRep`)
    .then(res => {
      if (res.data.success) {
        const data = res.data.data
        const arrays = []
        data.forEach(arr => arrays.push(arr))
        const mpRoles = mergeArraysAndFilteringByType(type, ...arrays)
        const mpRolesSorted = sortingBasedOnDate(mpRoles)
        return mpRolesSorted
      }
    })
    .catch(console.error)
}

export async function getAllDesc (arr) {
  arr.forEach(async (element) => {
    element.desc = await getDescription(titleCase(loadingTextTitle(element)))
  })
  return arr
}

export function sortingBasedOnDate (arr) {
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
    .then(res => {
      let desc = ''
      if (res.data.success) {
        desc = res.data.data.description
      }
      return desc
    }).catch(console.error)
}

export function titleCase (str) {
  const regex = /(^|\b(?!(and?|at?|the|for|to|but|by|of)\b))\w+/g
  return str.toLowerCase()
    .replace(regex, s => s[0].toUpperCase() + s.slice(1))
}

export async function fetchUserRiding (userEmail) {
  return axios
    .get(`/api/users/${userEmail}/getUser`)
    .then(res => {
      if (res.data.success) {
        return res.data.data.riding
      }
    })
    .catch(console.error)
}

export async function fetchRidingCode (riding) {
  return axios
    .get(`/api/ridings/getRidingCode/${encodeURI(riding)}`)
    .then(res => {
      if (res.data.success) {
        return res.data.data.code
      }
    })
    .catch(console.error)
}

export async function fetchRepresentative (riding) {
  return axios
    .get(`/api/representatives/${riding}/getRepresentative`)
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

export function totalBillsArray (arr) {
  const totalBills = arr.filter((thing, index, self) =>
    index === self.findIndex((t) => (
      t.billsClassified.number === thing.billsClassified.number
    ))
  )
  return totalBills.length
}
