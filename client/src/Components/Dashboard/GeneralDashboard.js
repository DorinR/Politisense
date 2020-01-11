import React from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import BarChartWrapper from './Charts/Wrappers/BarChartWrapper'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import ChartCard from './ChartCard'
import RadarChart from './Charts/RadarChart'

export default function CategoryDashboard () {
  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Card>
          <CardHeader />
          <BarChartWrapper type='bar-pie' />
          <CardContent>
            <Typography variant='body2' color='textSecondary' component='p'>
                Voting record of your MP.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={1}>
        <Grid container spacing={2}>
          <Grid item={12}>
            <ChartCard title='MP Voting Distribution'> <RadarChart /> </ChartCard>
          </Grid>
          <Grid item={12}>
            <ChartCard title='Bipartisan Index'> <BarChartWrapper /> </ChartCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
