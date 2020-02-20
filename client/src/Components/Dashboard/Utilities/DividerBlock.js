import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  customBackground: {
    padding: '5px 0px',
    margin: '10px 0px',
    borderRadius: '10px'
  },
  customTypographyFont: {
    color: 'white',
    fontWeight: 'bold'
  }
}))

export default function DividerBlock (props) {
  const classes = useStyles()

  return (
    <div
      className={classes.customBackground}
      style={{ backgroundColor: props.color }}
    >
      <Typography variant='h6' className={classes.customTypographyFont}>
        {props.text}
      </Typography>
    </div>
  )
}
