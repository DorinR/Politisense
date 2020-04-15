import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CompareParties from './CompareParties/CompareParties'
import CompareRidings from './HistoricalComparison/CompareRidings'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2, 0, 6)
  }
}))

export default function CompareContainer () {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <CompareRidings />
      <Box m={15} />
      <CompareParties />
    </div>
  )
}
