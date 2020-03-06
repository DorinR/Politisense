import { useEffect, useState } from 'react'
import axios from 'axios'

export async function fetchPopulation (riding) {
  return axios
    .get(`/api/ridings/getRidingPopulation/${encodeURI(riding)}`)
    .then(res => {
      if (res.data.success) {
        return res.data.data.population
      }
    })
    .catch(console.error)
}

export default function RidingPopulation (props) {
  const [population, setPopulation] = useState('')

  useEffect(() => {
    async function getData () {
      if (props.riding) {
        setPopulation(await fetchPopulation(props.riding))
      }
    }
    getData()
  })

  return population
}
