import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Link from '@material-ui/core/Link'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import NotificationsIcon from '@material-ui/icons/Notifications'
import { mainListItems, secondaryListItems } from './Listitems'
import Chart from './Chart'
import Deposits from './Deposits'
import Orders from './Orders'
import {D3Chart} from './D3Chart'
import * as d3 from 'd3'
import { useState, useRef, useEffect } from 'react'
import { Button} from 'react-bootstrap';


// style for the btn
const btnStyle = {
  "float": "right",
  "position": "relative",
  "bottom": 20,
  "left":5,
  "right":40,
  "margin-right": 150

}

const drawerWidth = 240
const useStyles = makeStyles(theme =>
    ({
      root: {
        display: 'flex'
      },
      menuButton: {
        marginRight: 36
      },
      menuButtonHidden: {
        display: 'none'
      },
      title: {
        flexGrow: 1
      },
      drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        })
      },
      drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9)
        }
      },
      content: {
        flexGrow: 1,
      },
      container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4)
      },
      paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column'
      },
      fixedHeight: {
        height: 240
      },
      active: {
        borderRight: '5px solid #43D0C4'
      }
}))



const generateData = (value, length = 5) =>
d3.range(length).map((item, index) => ({
  date: index,
  value: Math.random() * 100
}));


export default function Dashboard () {

  const changeData = () => {
    setData(generateData())
  }

  const classes = useStyles()
  const [data, setData] = useState(generateData());
  const [open, setOpen] = useState(true)
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <Container maxWidth='lg' className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                 <D3Chart
                      data = {data}
                      width={800}
                      height={200}
                      innerRadius= {30}
                      outerRadius ={80} />
                <div>
                <Button style={btnStyle} type="submit" onClick={changeData} >Transform </Button>
                </div>
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits />
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Orders />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  )
}
