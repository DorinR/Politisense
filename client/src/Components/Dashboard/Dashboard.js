import React from 'react'
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import BarChartWrapper from './Charts/Wrappers/BarChartWrapper'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import { red } from '@material-ui/core/colors'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CategoryTable from './CategoryTable'
import ChartCard from './ChartCard'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'
import Box from '@material-ui/core/Box'
import RadarChart from './Charts/RadarChart'
import Testing from "./Testing";
const useStyles = makeStyles(theme => ({
  card: {
  },
  container: {
    margin: '20px',
    marginTop: '30px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  }
}))

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

function a11yProps (index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

export default function Dashboard () {
  const classes = useStyles()
  const theme = useTheme()
  const [expanded, setExpanded] = React.useState(false)
  const [tabValue, setTabValue] = React.useState(0)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleChangeIndex = index => {
    setTabValue(index)
  }

  return (
    <div className={classes.container}>
      <Testing/>
    </div>
  )
}
