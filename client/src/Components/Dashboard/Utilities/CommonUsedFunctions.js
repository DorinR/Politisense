import axios from 'axios'

export async function fetchCategories() {
  return axios
    .get('/api/bills/fetchCategories')
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
}

export function mergeArrays(rawData) {
  let jointArray = []

  rawData.forEach(array => {
    if (array) {
      jointArray = [...jointArray, ...array]
    }
  })
  const test = [...new Set([...jointArray])]
  return test
}

export function formatingCategories(categoriesList) {
  const modifiedArray = categoriesList.map(element => {
    if (element.includes('-')) {
      return capitalizedName(element.replace('-', ' '))
    }
    return capitalizedName(element)
  })
  return modifiedArray
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
    name = name.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
    return name
  }
  return null
}

export function calculateTotalVotesBills(bills) {
  let totalBills = 0
  if (bills) {
    bills.forEach(bill => totalBills++)
  }
  return totalBills
}

export function getPartyColor(partyName) {
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

export function numericalStyling(amount) {
  const styling = Math.floor(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return styling
}

export function getPortraitColor(partyName) {
  switch (partyName) {
    case 'liberal':
      return {
        marginRight: 26,
        width: 50,
        height: 50,
        border: '4px solid #D71921'
      }
    case 'conservative':
      return {
        marginRight: 26,
        marginTop: -10,
        width: 50,
        height: 50,
        border: '3px solid #0C499C'
      }
    case 'ndp':
      return {
        marginRight: 26,
        width: 50,
        height: 50,
        border: '4px solid #EF7E52'
      }
    case 'bloc québécois':
      return {
        marginRight: 26,
        width: 50,
        height: 50,
        border: '3px solid #02819E'
      }
    case 'green party':
      return {
        marginRight: 26,
        width: 50,
        height: 50,
        border: '3px solid #2E8724'
      }
    case 'independent':
      return {
        marginRight: 26,
        marginBottom: 10,
        width: 50,
        height: 50,
        border: '3px solid black'
      }
    default:
      return {
        marginRight: 26,
        width: 50,
        height: 50,
        border: '3px solid white'
      }
  }
}

export async function fetchUserRiding(userEmail) {
  return axios
    .get(`/api/users/${userEmail}/getUser`)
    .then(res => {
      if (res.data.success) {
        return res.data.data.riding
      }
    })
    .catch(console.error)
}

export async function getAllBillsByHead(head) {
  const res = await axios.get(`/api/bills/${head}/getAllBillsByHead`)
  return res.data.data
}

export function calcPercent(percent) {
  return [percent, 100 - percent]
}

export async function getPartyData(party) {
  return axios
    .get(`/api/parties/${party.toLowerCase()}/getAllPartydata`)
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}
