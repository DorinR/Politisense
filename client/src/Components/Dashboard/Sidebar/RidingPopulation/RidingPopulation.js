import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { LinearProgress } from '@material-ui/core'

export async function fetchPopulation(riding) {
  return axios
    .get(`/api/ridings/getRidingPopulation/${encodeURI(riding)}`)
    .then((res) => {
      if (res.data.success) {
        return res.data.data.population
      }
    })
    .catch(console.error)
}

export default function RidingPopulation(props) {
  const [population, setPopulation] = useState(null)

  useEffect(() => {
    async function getData() {
      if (props.riding) {
        const pop = await fetchPopulation(props.riding)
        setPopulation(pop)
      }
    }
    getData()
  }, [props.riding])

  return (
    <span>
      {population ? (
        <span>{Number(population).toLocaleString('fr-CA')}</span>
      ) : (
          <span>
            <LinearProgress />
          </span>
        )}
    </span>
  )
}
