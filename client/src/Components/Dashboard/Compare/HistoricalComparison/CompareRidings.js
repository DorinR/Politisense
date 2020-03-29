import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ModernRepresentative from './ModernRepresentative'
import RepresentativeCardRiding from './RepresentativeCardRiding'
import { getAllBillsByHead } from '../../Utilities/CommonUsedFunctions'
import Typography from '@material-ui/core/Typography'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import InfoBubble from '../../Utilities/InfoBubble'

const useStyles = makeStyles(theme => ({
  content: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  customHeaders: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: '3em',
    marginLeft: '-46px'
  },
  customTooltip: {
    marginLeft: '5px',
    paddingTop: '20px'
  }
}))

export default function CompareRepresentatives() {
  // eslint-disable-next-line no-use-before-define
  const classes = useStyles()
  const [pastRep, setPastRep] = useState('')

  const updatePastRep = rep => {
    if (pastRep === rep || rep === '') {
    } else {
      setPastRep(rep)
    }
  }

  useEffect(() => {
    async function getBills() {
      await getAllBillsByHead(pastRep, 'pastRep')
    }

    if (pastRep !== '') {
      getBills()
    }
  }, [pastRep])

  const compareHistoricalExplanationTitle = 'Riding History'
  const compareHistoricalExplanationDescription = `Have a look at the historical data of past MPs of your riding!`

  return (
    <>
      <CssBaseline />
      <div>
        <Container maxWidth='l'>
          <Container>
            <Typography
              style={{ display: 'inline-block' }}
              className={classes.customHeaders}
              align='left'
              color='textPrimary'
              gutterBottom
            >
              Riding History
            </Typography>
            <span className={classes.customTooltip}>
              <InfoBubble
                title={compareHistoricalExplanationTitle}
                text={compareHistoricalExplanationDescription}
              />
            </span>
          </Container>
          <Typography
            variant='h5'
            align='center'
            color='textSecondary'
            paragraph
          >
            Have a look at the historical data of past MPs of your riding!
          </Typography>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <ModernRepresentative />
              </Grid>
              <Grid item xs={6}>
                <RepresentativeCardRiding updateHead={updatePastRep} />
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
    </>
  )
}
