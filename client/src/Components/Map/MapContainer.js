import MapWrapper from './MapWrapper'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function MapContainer () {
    const [data, setData] = useState(null)

    useEffect(() => {
        async function fetchData () {
            await axios
                .get(`http://localhost:5000/api/ridings/getRidingByRidingCode`)
                .then(res => {
                    if (res.data.success) {
                        setData(res.data.data)
                        console.log(res)
                        return res.data.data
                    }
                })
                .catch(console.error)
        }
        fetchData()
    },[])

    return (
        <div >
            {data !== null && data !== undefined?<MapWrapper data={data}/>:""}
            {/*<MapWrapper/>*/}
        </div>
    )
}