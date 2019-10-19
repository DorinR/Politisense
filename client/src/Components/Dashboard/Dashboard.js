import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { D3Chart } from './D3Chart'
import * as d3 from 'd3'
import votingRecord from './voting_record.csv'

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
      flexGrow: 1
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      paddingLeft: theme.spacing(0)
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      height: 'auto',
      flexDirection: 'column'
    },
    fixedHeight: {
      height: 240
    },
    active: {
      borderRight: '5px solid #43D0C4'
    }
  }))

export default function Dashboard () {
  const classes = useStyles()
  const [data, setData] = useState([])
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  useEffect(() => {
    getVotingRecord()
  }, [])

  const getVotingRecord = () => {
    d3.csv(votingRecord).then(data => {
      setData(data)
    })
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <Container maxWidth='lg' className={classes.container}>
          <Grid container>
            <Grid item xs={3} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <div className='parent'>
                  <Typography>
                  Total Votes for Healthcare
                  </Typography>
                  <D3Chart
                    data={data}
                    height={200}
                    innerRadius={0}
                    outerRadius={30}
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  )
}
