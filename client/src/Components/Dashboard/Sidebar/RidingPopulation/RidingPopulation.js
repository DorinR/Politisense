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
        const pop = await fetchPopulation(props.riding)
        setPopulation(pop)
      }
    }
    getData()
  })

  return population
}
