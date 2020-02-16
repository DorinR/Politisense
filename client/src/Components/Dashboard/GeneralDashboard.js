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
import BillDialog from "./BillDialog";
import TableDialog from "./TableDialog";
import DescriptionIcon from '@material-ui/icons/Description';
import CardActionArea from '@material-ui/core/CardActionArea';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import DialogRadarChart from "./DialogRadarChart";
import {getLegend} from "./Charts/DonutChart";
import {Paper} from "@material-ui/core";
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles =makeStyles(theme => ({
  card: {
    minWidth: 500,
    maxWidth: 1000,

    // marginLeft: "16%"
    // boxShadow: 'none',
  },
  radarCard:{
         maxWidth:500,
        minWidth: 300,
        // marginLeft: "300"
  },
  cardContent:{
    noPadding: {
      marginBottom: 30,
      flexGrow: 1,


    },  },
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
    margin: '5px',
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
  },
  avatar: {
    backgroundColor: '#43D0C4',
  },
  cardHeader: {
    backgroundColor:'#43D0C4',
    color: "white"
  },
  comp:{
    marginLeft: "280"

  }
}))

export default function CategoryDashboard() {
  const classes = useStyles()
  const [categoryList] = React.useState([
    'Economics',
    'Healthcare',
    'Human Rights',
    'Business',
    'Religion',
    'Criminal',
    'Trade'
  ])
  const [userRepresentative, setUserRepresentative] = React.useState('')
  const [representativeData, setRepresentativeData] = React.useState([])
  const [radarData, setRadarData] = React.useState([])
  const [repDataLoaded, setRepDataLoaded] = React.useState(false)
  const [donutData, setDonutData] = React.useState([])
  const [reps, setReps] = React.useState([])
  const [userRepIssuedBills, setUserRepIssuedBills] = React.useState([])
  const [rows, setRows] = React.useState([])
  const [expanded, setExpanded] = React.useState(false);
  const [billInfo, setBillInfo] = React.useState([])
  const [billOpen, setBillOpen] = React.useState(false)
  // Bar Pie Chart table
  const [tableContents, setTableContents] = React.useState([])
  const [tableDialogOpen, setTableDialogOpen] = React.useState(false)
  // // radar table
  const [rowsRadar, setRowsRadar] = React.useState([])
  const [tableRadarContents, setTableRadarContents] = React.useState([])
  const [tableRadarDialogOpen, setTableRadarDialogOpen] = React.useState(false)
  const[expandedRadar, setExpandedRadar]= React.useState(false)


  // Donut table
  const [rowsDonut, setRowsDonut] = React.useState([])
  const [tableDonutContents, setTableDonutContents] = React.useState([])
  const [tableDonutDialogOpen, setTableDonutDialogOpen] = React.useState(false)

  const [expandedDonut, setExpandedDonut] = React.useState(false)


  const handleExpandClickRadar = () =>{
    setExpandedRadar(!expandedRadar);
  }
  const handleRadarClose = () => {
    setTableRadarDialogOpen(false)
  }
  // learn more button for bar-pie chart comp + table
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandClickDonut = () =>{
    setExpandedDonut(!expandedDonut);
  }

  // bill dialog
  const handleBillClickOpen = (row,type) => {
    if(row && type =='bar-pie'){
    let temp = {
      name: row.bill.billsClassified.number,
      desc:row.bill.billsClassified.title,
      link:row.bill.billsClassified.link,
      sponsor:row.bill.billsClassified.sponsorName,
      date:row.bill.billsClassified.dateVoted

    }
    setBillInfo(temp)
    setBillOpen(true)
    }
    if(row && type =='radar'){
      let temp = {
        name: row.billData.number,
        desc:row.billData.title,
        link:row.billData.link,
        sponsor:row.billData.sponsorName,
         date:row.billData.dateVoted

      }
      setBillInfo(temp)
      setBillOpen(true)
    }
  }
  const handleBillClose = () => {
    setBillOpen(false)
  }

  // click on the chart of pie part chart
  const handleBarPieChartClickOpen = (rows) => {
    setTableContents(rows)
    setTableDialogOpen(true)
  }

  const handleBarPieChartClose = () => {
    setTableDialogOpen(false)
  }

  const handleRadarClickOpen = (rows) => {
    setTableRadarContents(rows)
    setTableRadarDialogOpen(true)
  }

  const handleDonutClickOpen = (rows) => {
    setTableDonutContents(rows)
    setTableDonutDialogOpen(true)
  }



  useEffect(() => {
    async function getDataForDonut() {
      if (reps.length && representativeData.length) {
        const data = await createDataSetDonut(reps, representativeData)
        if (
            !(data[0].Liberal == 0 &&
          data[0].Conservative == 0 &&
          data[0].NDP == 0 &&
          data[0].BQ == 0 &&
          data[0].Green == 0 &&
          data[0].People == 0)
        ) {
          setDonutData(data[0])
          setRowsDonut(data[1])
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
        console.log(issuedBillByUserRep)
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
      getAllBillsByRep(userRepresentative).then(results => {
        setRowsRadar(results)
      })
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
      <Grid container
            direction={"row"}
            justify="center"
            spacing={6}
      >
        <Grid item xs={10} md={10}>
          {userRepIssuedBills.length !== 0 && categoryList.length !== 0? (
              <div>
            <Card className={classes.card}>
              <CardHeader
                  className={classes.cardHeader}
                  action={
                    <IconButton aria-label="settings">
                      <HelpOutlineOutlinedIcon style={{color:"white"}}/>
                    </IconButton>
                    }
                   title={
                     <div>
                       <Typography variant="h4" align="center" color={"white"}>
                         Bar Pie Chart
                       </Typography>
                     </div>
                   }
              />
              <Divider />
              <CardContent className={classes.cardContent.noPadding}>
                  <CardActionArea>
                    <div onClick={() => handleBarPieChartClickOpen(rows)}>
                      <Typography variant="h5" align="center" color={"white"}>
                        Bills sponsored by {capitalizedName(userRepresentative)}
                      </Typography>
                      <BarChartWrapper
                        type='bar-pie'
                        data={userRepIssuedBills}
                        categories={categoryList}
                      />
                    </div>
                 </CardActionArea >
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                          <DescriptionIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText>
                        The distribution of issued bills by the representative
                        among different categories
                      </ListItemText>
                      <IconButton
                          className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                          })}
                          onClick={handleExpandClick}
                          aria-expanded={expanded}
                          aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </ListItem>
                  </List>
              </CardContent>
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
                                    <Button color='primary' onClick={() => handleBillClickOpen(row,'bar-pie')}>
                                      <Typography>{row.bill.billsClassified.number}</Typography>
                                    </Button>
                                  </TableCell>
                                  <TableCell component='th' scope='row'><Typography>{row.category}</Typography></TableCell>
                                  <TableCell align='right'><Typography style= {row.status === 'Passed'? {color:"green"}: {color: "red"}}>{row.status}</Typography></TableCell>
                                </TableRow>
                            ))}
                          </TableBody>) : 'nothing'}
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
        <div className={classes.comp}>
        <Grid container
              direction={"row"} spacing={8}
              justify="center" >
          <Grid item xs={5} md={5}>
        {radarData.length !== 0 && categoryList.length !== 0 ? (
              <div>
                  <Card className={classes.radarCard}>
                    <CardHeader
                        className={classes.cardHeader}
                        action={

                          <IconButton aria-label="settings">
                            <HelpOutlineOutlinedIcon style={{color:"white"}}/>
                          </IconButton>
                        }
                        title={
                          <div>
                            <Typography variant="h4" align="center" color={"white"}>
                              Radar Chart
                            </Typography>
                          </div>

                        }
                    />
                    <Divider />
                    <CardActionArea>
                    <CardContent>
                      <div onClick={() => handleRadarClickOpen(rowsRadar)}>
                        <Typography variant="h5" align="center" color={"white"}>
                          MP Voting Distribution
                        </Typography>
                      <Radar
                          width={400}
                          height={385}
                          padding={55}
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
                      </div>
                    </CardContent>
                    </CardActionArea>
                    <CardContent>
                      <List>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                              <DescriptionIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText>
                            This radar chart shows the MP's activity with
                                  respect to a variety categories.
                          </ListItemText>
                          <IconButton
                              className={clsx(classes.expand, {
                                [classes.expandOpen]: expandedRadar,
                              })}
                              onClick={handleExpandClickRadar}
                              aria-expanded={expanded}
                              aria-label="show more"
                          >
                            <ExpandMoreIcon />
                          </IconButton>
                        </ListItem>
                      </List>
                    </CardContent>
                    <Collapse in={expandedRadar} timeout="auto" unmountOnExit>
                      <CardContent>
                        <Typography paragraph>The bills are: </Typography>
                        <TableContainer className={classes.tableContainer}>
                          <Table className={classes.table} size='medium' aria-label='a dense table'>
                            <TableHead>
                              <TableRow>
                                <TableCell>{"Bill Name"}</TableCell>
                                <TableCell>{"Category"}</TableCell>
                                <TableCell align='right'>{"Vote"}</TableCell>
                              </TableRow>
                            </TableHead>
                            {(rowsRadar.length) > 0 ? (
                                <TableBody stickyHeader>
                                  {rowsRadar.map((row,i)=> (
                                      <TableRow key={i}>
                                        <TableCell component='th' scope='row'>
                                          <Button color='primary' onClick={() => handleBillClickOpen(row,'radar')}>
                                            <Typography>{row.voteRecord.billNumber}</Typography>
                                          </Button>
                                        </TableCell>
                                        <TableCell component='th' scope='row'><Typography>{row.billData.category}</Typography></TableCell>
                                        <TableCell align='right'>
                                          <Typography style= {row.voteRecord.yea === true? {color:"green"}: {color: "red"}}>
                                            {row.voteRecord.yea == true? "Yea": "Nay"}
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                  ))}
                                </TableBody>) : ''}
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Collapse>
                  </Card>
                <DialogRadarChart representativeData={tableRadarContents} categoryList= {categoryList} open={tableRadarDialogOpen} onClose={handleRadarClose}> </DialogRadarChart>
              </div>
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

        <Grid item xs={5} md={5}>
        {donutData.length ? (
              <Card className={classes.radarCard}>
                <CardHeader
                    className={classes.cardHeader}
                    action={

                      <IconButton aria-label="settings">
                        <HelpOutlineOutlinedIcon style={{color:"white"}}/>
                      </IconButton>
                    }
                    title={
                      <div>
                        <Typography variant="h4" align="center" color={"white"}>
                          Bipartisan Index
                        </Typography>
                      </div>
                    }
                />
                <CardContent>
                  <CardActionArea>
                  <div onClick={() => handleDonutClickOpen(rowsDonut)}>
                    <Typography className={classes.title}>
                      Bipartisan Index
                    </Typography>
                    <BarChartWrapper type='gauge' data={donutData} />
                  </div>
                  </CardActionArea>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar className={classes.avatar}>
                            <DescriptionIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                          This radar chart shows the MP's activity with respect to a variety categories.
                        </ListItemText>
                        <IconButton
                            className={clsx(classes.expand, {
                              [classes.expandOpen]: expandedRadar,
                            })}
                            onClick={handleExpandClickDonut}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </ListItem>
                    </List>
                </CardContent>
                <Collapse in={expandedDonut} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography paragraph>The issued bills are: </Typography>
                    <TableContainer className={classes.tableContainer}>
                      <Table className={classes.table} size='medium' aria-label='a dense table'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Bill Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Vote</TableCell>
                            <TableCell>Political Party</TableCell>
                          </TableRow>
                        </TableHead>
                        {(rowsDonut.length) > 0 ? (
                            <TableBody stickyHeader>
                              {rowsDonut.map((row,i)=> (
                                  <TableRow key={i}>

                                    <TableCell component='th' scope='row'>
                                      <Button color='primary' onClick={() => handleBillClickOpen(row,'bar-pie')}>
                                        <Typography>{row.billDetails.billData.number}</Typography>
                                      </Button>
                                    </TableCell>

                                    <TableCell component='th' scope='row'>
                                      <Typography>{row.billDetails.billData.category}</Typography>
                                    </TableCell>

                                    <TableCell component='th' scope={'row'}>
                                      <Typography style= {{color:"green"}}>{row.billDetails.voteRecord.yea == true ? "Yea":"Nay"}</Typography>
                                    </TableCell>

                                    <TableCell component='th' scope={'row'}>
                                      <Typography>{row.category}</Typography>
                                    </TableCell>

                                  </TableRow>
                              ))}
                            </TableBody>) : 'nothing'}
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Collapse>
              </Card>
        ) : (
            ''
        )}
        </Grid>
      </Grid>
        </div>
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
  let bills=[],
      liberalCounter = 0,
      conservativeCounter = 0,
      ndpCounter = 0,
      peopleCounter = 0,
      greenCounter = 0,
      bqCounter = 0

  if (mpdata.length) {
    mpdata.forEach(bill => {
      if (bill.voteRecord.yea === true) {
        sponsors.forEach(sponsor => {
          if (sponsor.name === bill.billData.sponsorName) {
            switch (sponsor.politicalParty) {
              case 'liberal':
                liberalCounter++
                bills.push({billDetails: bill, category: "Liberal"})
                break
              case 'conservative':
                conservativeCounter++
                bills.push({billDetails:bill,category:'Conservative'})
                break
              case 'ndp':
                ndpCounter++
                bills.push({billDetails: bill, category: "NDP"})
                break
              case 'bloc québécois':
                bqCounter++
                bills.push({billDetails: bill, category: "Bloc Québécois"})
                break
              case 'green':
                greenCounter++
                bills.push({billDetails: bill, category: "Green"})
                break
              case 'people':
                peopleCounter++
                bills.push({billDetails: bill, category: "People"})
                break
              default:
                return 'nothing'
            }
          }
        })
      }
    })
  }
  let dataRadialChart = []
  let parties = [
  {category : "Liberal" , freq: liberalCounter},
  {category : "Conservative" , freq: conservativeCounter},
  {category : "NDP" , freq: ndpCounter},
  {category : "People" , freq: peopleCounter},
  {category : "Green" , freq: greenCounter},
  {category : "BQ" , freq: bqCounter},
  ]

  parties.forEach((element,i) => {
    let percentage= getLegend(element,parties)
    parties[i].value =percentage
  })
 parties= sortBasedOnLargest(parties)

  console.log(parties)
  return [parties,bills]
}

export async function createDataPieBarTable(categories, data) {

  let billsForSpeicificCategory =[]
  let finalArray=[]
  categories.forEach(category => {

    let totalBills = 0

    data.forEach(bill => {
      if (bill.billsClassified.category === (category.toLowerCase())) {
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

export function sortBasedOnLargest(list){
  return list.sort(function(a, b){
    return a.value-b.value
  })

}