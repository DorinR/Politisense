/* eslint-disable */
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
  const test = [...new Set([...jointArray])]
  return test
}

export function formatingCategories (categoriesList) {
  const modifiedArray = categoriesList.map(element => {
    if (element.includes('-')) {
      return capitalizedName(element.replace('-', ' '))
    }
    return capitalizedName(element)
  })
  return modifiedArray
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
  // Utility function to compute percentage.
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
      title = element.group
      const n = title.indexOf('parliamentary')
      title = title.slice(0, n)
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
