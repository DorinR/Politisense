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
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Card className={classes.card}>
            <CardHeader />
            <BarChartWrapper type='bar-pie' />
            <CardContent>
              <Typography variant='body2' color='textSecondary' component='p'>
                                Voting record of your MP.
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label='show more'
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout='auto' unmountOnExit>
              <CardContent>

                <Tabs
                  value={tabValue}
                  onChange={handleChange}
                  indicatorColor='primary'
                  textColor='primary'
                  variant='fullWidth'
                  aria-label='full width tabs example'
                >
                  <Tab label='Healthcare' {...a11yProps(0)} />
                  <Tab label='Economics' {...a11yProps(1)} />
                </Tabs>
                <SwipeableViews
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={tabValue}
                  onChangeIndex={handleChangeIndex}
                >
                  <TabPanel value={tabValue} index={0} dir={theme.direction}>
                    <CategoryTable />
                  </TabPanel>
                  <TabPanel value={tabValue} index={1} dir={theme.direction}>
                    <CategoryTable />
                  </TabPanel>
                </SwipeableViews>
              </CardContent>
            </Collapse>
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
    </div>
  )
}
