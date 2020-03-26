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

export function calculateTotalVotesBills (bills) {
  let totalBills = 0
  if (bills) {
    bills.forEach(bill => totalBills++)
  }
  return totalBills
}

export function getPartyColor (partyName) {
  switch (partyName) {
    case 'liberal':
      return {
        backgroundColor: '#D71921',
        color: 'white'
      }
    case 'conservative':
      return {
        backgroundColor: '#0C499C',
        color: 'white'
      }
    case 'ndp':
      return {
        backgroundColor: '#EF7E52',
        color: 'white'
      }
    case 'bloc québécois':
      return {
        backgroundColor: '#02819E',
        color: 'white'
      }
    case 'green party':
      return {
        backgroundColor: '#2E8724',
        color: 'white'
      }
    case 'independent':
      return {
        backgroundColor: 'black',
        color: 'white'
      }
    default:
      return {
        backgroundColor: 'white',
        color: 'white'
      }
  }
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

export async function getAllBillsByHead (head) {
  const res = await axios.get(`/api/bills/${head}/getAllBillsByHead`)
  return res.data.data
}
