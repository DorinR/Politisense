import React, {useEffect, useState} from 'react'
import Grid from '@material-ui/core/Grid'
import D3ChartHeadVsHeadComparison from './Charts/Wrappers/D3ChartHeadVsHeadComparison'
import ChartCard from './ChartCard'


export default function D3ChartHeadVsHeadContainer (props) {
    const [dataSet, setDataSet] = useState(props.data)



    return (
        <div>
            <Grid container spacing={4} direction="row">
                <ChartCard title='Similarities'> <D3ChartHeadVsHeadComparison data={dataSet} /> </ChartCard>
            </Grid>

        </div>

    )



}