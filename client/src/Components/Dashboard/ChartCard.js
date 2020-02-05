import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  card: {
    width: '100%'
  },
  title: {
    fontSize: 18,
    textAlign: 'center'
  }
})
export default function SimpleCard ({ children, title }) {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} gutterBottom>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  )
}
