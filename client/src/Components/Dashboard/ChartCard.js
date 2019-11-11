import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import RadarChart from './Charts/RadarChart'
const useStyles = makeStyles({
  card: {
    width: 450
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 18,
    textAlign: 'center'
  },
  pos: {
    marginBottom: 12
  }
})
export default function SimpleCard ({ children, title }) {
  const classes = useStyles()
  const bull = <span className={classes.bullet}>•</span>
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
