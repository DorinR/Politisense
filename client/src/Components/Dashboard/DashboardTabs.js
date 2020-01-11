import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
//import CategoryDashboard from './CategoryDashboard'
import BillHistoryTable from './PastBills/BillHistoryTable'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import BarChartIcon from '@material-ui/icons/BarChart'
import PieChartIcon from '@material-ui/icons/PieChart';

import IconButton from "@material-ui/core/IconButton";
import GeneralDashboard from "./GeneralDashboard";

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
      <Typography
          component='div'
          role='tabpanel'
          hidden={value !== index}
          id={`scrollable-force-tabpanel-${index}`}
          aria-labelledby={`scrollable-force-tab-${index}`}
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
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%'
  }
}))

export default function DashboardTabs () {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
      <Box p={5}>
        <div className={classes.root}>
          <AppBar position='static' color='default'>
            <Tabs
                value={value}
                onChange={handleChange}
                variant='scrollable'
                scrollButtons='on'
                indicatorColor='primary'
                textColor='primary'
                aria-label='scrollable force tabs example'
            >
              <Tab
                  label='General'
                  icon={<BarChartIcon/>}
                  {...a11yProps(0)}
              />
              <Tab
                  label='Categories'
                  icon={<PieChartIcon />}
                  {...a11yProps(1)}
              />
              <Tab
                  label='Voting History'
                  icon={<AccountBalanceIcon />}
                  {...a11yProps(2)}
              />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <GeneralDashboard />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CategoryDashboard />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <BillHistoryTable />
          </TabPanel>
        </div>
      </Box>
  )
}