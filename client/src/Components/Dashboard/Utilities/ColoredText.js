import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  customText: {
    fontWeight: 'bold'
  }
}))

export default function ColoredText(props) {
  const classes = useStyles()

  return (
    <span style={{ color: props.color }} className={classes.customText}>
      {props.text}
    </span>
  )
}
