/* eslint-disable */
import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import BarChartWrapper from './Charts/Wrappers/BarChartWrapper'
import Radar from 'react-d3-radar'
import axios from 'axios'
import { fetchUserRiding } from '../Navbar'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation'
import Box from '@material-ui/core/Box'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import List from '@material-ui/core/List'
import { capitalizedName } from './BillDialog'
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HelpIcon from '@material-ui/icons/Help';
import Divider from '@material-ui/core/Divider';
import Button from "@material-ui/core/Button";
import clsx from 'clsx';
import CardActions from "@material-ui/core/CardActions";
import Collapse from '@material-ui/core/Collapse';
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {populateTable,createData} from "./CategoryCard";
import BillDialog from "./BillDialog";
import TableDialog from "./TableDialog";
const useStyles = makeStyles(theme => ({
  card: {
    minWidth: 275,
    // boxShadow: 'none',

  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  pos: {
    marginBottom: 12
  },
  title: {
    fontSize: 18,
    textAlign: 'center'
  },
  MuiAvatar: {
    backgroundColor: '#43D0C4'
  },
  container: {
    margin: '20px',
    marginTop: '30px'
  },
  expand: {
    // transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    // transform: 'rotate(180deg)',
  },
  tableContainer : {
      maxHeight: 200,
  }

}))

export default function CategoryDashboard() {
  const classes = useStyles()
  const [categoryList] = React.useState([
    'economics',
    'healthcare',
    'human rights',
    'business',
    'religion',
    'criminal',
    'trade'
  ])
  const [userRepresentative, setUserRepresentative] = React.useState('')
  const [representativeData, setRepresentativeData] = React.useState([])
  const [radarData, setRadarData] = React.useState([])
  const [repDataLoaded, setRepDataLoaded] = React.useState(false)
  const [donutData, setDonutData] = React.useState([])
  const [reps, setReps] = React.useState([])
  const [userRepIssuedBills, setUserRepIssuedBills] = React.useState([])
  const [expanded, setExpanded] = React.useState(false);
  const [rows, setRows] = React.useState([])

  const [billInfo, setBillInfo] = React.useState([])
  const [billOpen, setBillOpen] = React.useState(false)

  const [tableContents, setTableContents] = React.useState([])
  const [tableDialogOpen, setTableDialogOpen] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleBillClickOpen = (row) => {
    if(row){
    let temp = {
      name: row.bill.billsClassified.number,
      desc:row.bill.billsClassified.title,
      link:row.bill.billsClassified.link,
      sponsor:row.bill.billsClassified.sponsorName,
      data:row.bill.billsClassified.dateVoted
    }
    console.log(temp)
    setBillInfo(temp)
    setBillOpen(true)
    }
  }

  const handleBillClose = () => {
    setBillOpen(false)
  }

  const handleBarPieChartClickOpen = (rows) => {
    setTableContents(rows)
    setTableDialogOpen(true)
  }

  const handleBarPieChartClose = () => {
    setTableDialogOpen(false)
  }

  useEffect(() => {
    async function getDataForDonut() {
      if (reps.length && representativeData.length) {
        const data = await createDataSetDonut(reps, representativeData)
        if (
          data.Liberal !== 0 &&
          data.Liberal !== 0 &&
          data.Liberal !== 0 &&
          data.Liberal !== 0 &&
          data.Liberal !== 0 &&
          data.Liberal !== 0
        ) {
          setDonutData([data])
        }
      }
    }
    async function getAllReps() {
      let result = []
      await axios
        .get('http://localhost:5000/api/representatives/getAllRepresentatives')
        .then(res => {
          if (res.data.success) {
            result = res.data.data
          }
        })
        .catch(err => console.error(err))
      return result
    }

    async function getAllBillsByRep(head) {
      let result = []
      await axios
        .get(`http://localhost:5000/api/bills/${head}/getAllBillsByRep`)
        .then(res => {
          if (res.data.success) {
            result = res.data.data
            setRepresentativeData(result)
            setRepDataLoaded(true)
          }
        })
        .catch(err => console.error(err))
      return result
    }
    async function getAllBillsBySponsorName(head) {
      let result = []
      await axios
        .get(`http://localhost:5000/api/bills/${head}/getAllBillsBySponsorName`)
        .then(res => {
          if (res.data.success) {
            result = res.data.data
          }
        })
        .catch(err => console.error(err))
      return result
    }
    async function getData() {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        const { email } = user
        const riding = await fetchUserRiding(email)
        const representative = await fetchRepresentative(riding)
        const allRepresentatives = await getAllReps()
        setUserRepresentative(representative)
        setReps(allRepresentatives)
        const issuedBillByUserRep = await getAllBillsBySponsorName(
          representative
        )
        setUserRepIssuedBills(issuedBillByUserRep)
        if (representative.length !== 0) {
          setUserRepresentative(representative)
        }
      }
    }
    getData()

    async function populateIssuedBill (userRepIssuedBills){
      const dataForTable = await createDataPieBarTable(categoryList,userRepIssuedBills)
      return dataForTable
    }
    if(userRepIssuedBills.length !== 0){
      populateIssuedBill(userRepIssuedBills).then(res => {
        setRows(res)
      })
    }

    if (userRepresentative) {
      getAllBillsByRep(userRepresentative).then(results => {})
    }

    if (categoryList && repDataLoaded) {
      createDataSetRadar(categoryList, representativeData).then(testing => {
        if (testing.length !== 0) {
          setRadarData(testing)
        }
      })
    }

    if (reps.length && repDataLoaded) {
      getDataForDonut()
    }

  }, [userRepresentative, repDataLoaded])



  async function fetchRepresentative(riding) {
    let result = ''
    await axios
      .get(
        `http://localhost:5000/api/representatives/${riding}/getRepresentative`
      )
      .then(res => {
        if (res.data.success) {
          result = res.data.data.name
        }
      })
      .catch(err => console.error(err))
    return result
  }
  return (
    <div className={classes.container}>
      <CssBaseline />
      <Grid container spacing={1}>

        <Grid item xs={12}>
          {userRepIssuedBills.length !== 0 && categoryList.length !== 0 ? (
              <div>
            <Card className={classes.card}>
              <CardHeader
                  action={
                    <IconButton aria-label="settings">
                      <HelpIcon />
                    </IconButton>
                    }
                   title={
                     <Typography variant="h4" align="center" color={"textPrimary"}>
                       Bills sponsored by {capitalizedName(userRepresentative)}
                      </Typography>}
              />
              <Divider />
              <CardContent>
                <div onClick={() => handleBarPieChartClickOpen(rows)}>
                  <BarChartWrapper
                    type='bar-pie'
                    data={userRepIssuedBills}
                    categories={categoryList}
                  />
                </div>

                <Box border mx='auto'>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                          <NotListedLocationIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText>
                        The distribution of issued bills by the representative
                        among different categories
                      </ListItemText>
                    </ListItem>
                  </List>
                </Box>
              </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    color="primary"
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    // className={classes.button}
                    style={{marginLeft:"auto"}}
                >
                  Find More
                </Button>
            </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph>The issued bills are: </Typography>
                  <TableContainer className={classes.tableContainer}>
                    <Table className={classes.table} size='medium' aria-label='a dense table'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Bill Name</TableCell>
                          <TableCell> Category </TableCell>
                          <TableCell align='right'>Bill Status</TableCell>
                        </TableRow>
                      </TableHead>
                      {(rows.length) > 0 ? (
                          <TableBody stickyHeader>
                            {rows.map((row,i)=> (
                                <TableRow key={i}>
                                  <TableCell component='th' scope='row'>
                                    <Button color='primary' onClick={() => handleBillClickOpen(row)}>
                                      <Typography>{row.bill.billsClassified.number}</Typography>
                                    </Button>
                                  </TableCell>
                                  <TableCell component='th' scope='row'><Typography>{row.category}</Typography></TableCell>
                                  <TableCell align='right'><Typography>{row.status}</Typography></TableCell>
                                </TableRow>
                            ))}
                          </TableBody>) : 'nothing!'}
                    </Table>
                  </TableContainer>
                </CardContent>
              </Collapse>
            </Card>
                <BillDialog billInfo={billInfo} open={billOpen} onClose={handleBillClose} />
                <TableDialog rows={tableContents} open={tableDialogOpen} onClose={handleBarPieChartClose}> </TableDialog>

              </div>
          ) : (
            ''
          )}
        </Grid>

        {radarData.length !== 0 && categoryList.length !== 0 ? (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography className={classes.title}>
                      MP Voting Distribution
                    </Typography>
                    <Radar
                      width={400}
                      height={350}
                      padding={40}
                      domainMax={radarData[1] + 3}
                      highlighted
                      onHover={point => {
                        if (point) {
                        } else {
                        }
                      }}
                      data={{
                        variables: [
                          { key: 'trade', label: 'Trade' },
                          { key: 'criminal', label: 'Criminal' },
                          { key: 'business', label: 'Business' },
                          { key: 'Economics', label: 'Economics' },
                          { key: 'Healthcare', label: 'Healthcare' },
                          { key: 'Religion', label: 'Religion' },
                          { key: 'Human Rights', label: 'Human Rights' }
                        ],
                        sets: [
                          {
                            values: radarData[0]
                          }
                        ]
                      }}
                    />
                    <Box border mx='auto'>
                      <List>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                              <NotListedLocationIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText>
                            This radar chart shows the MP's activity with
                            respect to a variety categories.
                          </ListItemText>
                        </ListItem>
                      </List>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {donutData.length ? (
                <Grid item item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography className={classes.title}>
                        Bipartisan Index
                      </Typography>
                      <BarChartWrapper type='donut' data={donutData} />
                      <Box border mx='auto'>
                        <List>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar className={classes.avatar}>
                                <NotListedLocationIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText>
                              The Bipartisan Index measures how often a member
                              of Parliamnet introduces bills that succeed in
                              attracting co-sponsors from members of the other
                              party, and how often they in turn co-sponsor a
                              bill introduced from across the aisle.
                            </ListItemText>
                          </ListItem>
                        </List>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                ''
              )}
            </Grid>
          </Grid>
        ) : (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              zIndex: '-2',
              transform: 'translate(-50%, -50%)'
            }}>
            <CircularProgress />
          </div>
        )}
      </Grid>
    </div>
  )
}

export async function createDataSetRadar(categories, data) {
  const dataArray = []
  let temp = {}
  const dataSetRadar = {}
  let maxValue = 0
  categories.forEach(category => {
    let totalvotes = 0
    data.forEach(bill => {
      if (bill.billData.category === category.toLowerCase()) {
        totalvotes++
      }
    })
    const categorySmallLetter = category.toLowerCase().trim()
    temp = { category: categorySmallLetter, value: totalvotes }
    dataArray.push(temp)
  })

  dataArray.forEach(category => {
    if (category.value > maxValue) {
      maxValue = category.value
    }
    if (category.category) {
      dataSetRadar[category.category] = category.value
    }
  })

  return [dataSetRadar, maxValue]
}

export async function createDataSetDonut(sponsors, mpdata) {
  let liberalCounter = 0
  let conservativeCounter = 0
  let ndpCounter = 0
  let peopleCounter = 0
  let greenCounter = 0
  let bqCounter = 0
  let parties = {}

  if (mpdata.length) {
    mpdata.forEach(bill => {
      if (bill.voteRecord.yea === true) {
        sponsors.forEach(sponsor => {
          if (sponsor.name === bill.billData.sponsorName) {
            switch (sponsor.politicalParty) {
              case 'liberal':
                liberalCounter++
                break
              case 'conservative':
                conservativeCounter++
                break
              case 'ndp':
                ndpCounter++
                break
              case 'bloc québécois':
                bqCounter++
                break
              case 'green':
                greenCounter++
                break
              case 'people':
                peopleCounter++
                break
              default:
                return 'nothing'
            }
          }
        })
      }
    })
  }

  parties = {
    Liberal: liberalCounter,
    Conservative: conservativeCounter,
    NDP: ndpCounter,
    People: peopleCounter,
    Green: greenCounter,
    BQ: bqCounter
  }
  return parties
}

export async function createDataPieBarTable(categories, data) {
  const dataArray = []
  let temp = {}
  let billsForSpeicificCategory =[]
  let finalArray=[]
  categories.forEach(category => {

    let totalBills = 0

    data.forEach(bill => {
      if (bill.billsClassified.category === (category.toLowerCase())) {
        console.log("IM here")
        totalBills++
        if (bill.voteRecord.yeas > bill.voteRecord.nays) {
          billsForSpeicificCategory.push({bill:bill,category: category, status:'Passed'})
        } else {
          billsForSpeicificCategory.push({bill:bill ,category: category, status:'Failed'})
        }
      }
    })
    if (totalBills !== 0) {
         finalArray = finalArray.concat(billsForSpeicificCategory)
    }
  })
  return finalArray
}