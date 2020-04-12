import React from 'react'
import PollsNavbar from './PollsNavbar'
import Voting from './Voting'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'

export default function LegislativeActivities () {
  return (
    <>
      <CssBaseline />
      <div>
        <Container maxWidth='l'>
          <div>
            <Grid container spacing={12}>
              <Grid item xs={12}>
                <PollsNavbar />
              </Grid>
              <Grid item xs={12}>
                <Voting />
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
    </>
  )
}
