import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CompareRepresentatives from './CompareRepresentatives'
import CompareParties from './CompareParties/CompareParties'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles({
  container: {
    margin: '20px',
    marginTop: '30px'
  }
})

export default function CompareContainer () {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <CompareRepresentatives />
      <Box m={15} />
      <CompareParties />
    </div>
  )
}
