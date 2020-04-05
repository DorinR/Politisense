import { useEffect, useState } from 'react'
import axios from 'axios'
import { formatNumber } from '../../Utilities/CommonUsedFunctions'

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
  const [riding, setRiding] = useState(null)
  useEffect(() => {
    async function getData () {
      if (props.riding && props.riding !== riding) {
        setRiding(props.riding)
      }
    }
    getData()
  }, [props.riding, riding])

  useEffect(() => {
    async function getData () {
      if (riding) {
        setPopulation(formatNumber(await fetchPopulation(riding)))
      }
    }
    getData()
  }, [riding])

  return population
}
