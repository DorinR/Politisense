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

export async function checkUserExists (email) {
  return axios.post('/api/users/checkIfUserExists', { email: email }).then(res => {
    return res
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
