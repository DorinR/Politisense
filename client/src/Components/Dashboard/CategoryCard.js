import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import { red } from '@material-ui/core/colors'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import CompareArrowsIcon from '@material-ui/icons/CompareArrows'
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter'
import PieChartIcon from '@material-ui/icons/PieChart'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import GavelIcon from '@material-ui/icons/Gavel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBalanceScale, faHandshake, faPrayingHands } from '@fortawesome/free-solid-svg-icons'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import DeleteCategoryDialog from './DeleteCategoryDialog'
import ChartCard from './ChartCard'
import RadarChart from './Charts/RadarChart'
import BarChartWrapper from './Charts/Wrappers/BarChartWrapper'
import axios from 'axios'
import BillDialog from "./BillDialog";

const useStyles = makeStyles(theme => ({
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
  },
  table: {
    maxHeight: '10px',
  }
}))

function createData (name, vote, sponsor, date, desc, link, details) {
  return { name, vote, sponsor, date, desc, link , details}
}

export default function CategoryCard (props) {
  const classes = useStyles()
  const [openCompare, setOpenCompare] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
  const [confimedDeletion] = React.useState(false)
  const [rows, setRows] = React.useState([])
  const [billOpen, setBillOpen] = React.useState(false)

  const handleDeleteDialogClose = (newValue, index) => {
    if (newValue === true) {
      props.delete(index)
    }
    setOpenDeleteDialog(false)
  }

  const handleClickOpenCompare = () => {
    setOpenCompare(true)
  }

  const handleCloseCompare = () => {
    setOpenCompare(false)
  }

  const handleBillClickOpen = () => {
    setBillOpen(true)
  }

  const handleBillClose = () => {
    setBillOpen(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  function setCardLogo() {
    switch (title) {
      case 'Economics':
        return <TrendingUpIcon color='primary'/>
      case 'Trade':
        return <TrendingUpIcon color='primary'/>
      case 'Business':
        return <BusinessCenterIcon color='primary'/>
      case 'Criminal':
        return <GavelIcon color='primary'/>
      case 'Religion':
        return <FontAwesomeIcon icon={faPrayingHands} color='#43D0C4' size='lg'/>
      case 'Human Rights':
        return <FontAwesomeIcon icon={faBalanceScale} color='#43D0C4' size='lg'/>
      default:
        return <IndeterminateCheckBoxIcon color='primary'/>
    }
  }

  React.useEffect(() => {
    populateTable(props.representative)
    // setId(props.id)
    setTitle(props.title)
  }, [props.title])

  function openDialog(row){
    console.log(row)
  }

  async function populateTable(data) {
    let bills = data
    let filteredBills = []
    for (let i = 0; i < bills.length; i++) {
      if (bills[i].billData.category.trim().localeCompare(props.title.toLowerCase().trim()) === 0) {
        filteredBills.push(bills[i])
      }
    }
    console.log(filteredBills)
    let tableData = []
    for (let i = 0; i < filteredBills.length; i++) {
      let vote = ''
      if(filteredBills[i].voteRecord.paired){
        vote = 'abstain'
      } else if(filteredBills[i].voteRecord.yea){
        vote = 'yea'
      } else{
        vote = 'nay'
      }
      tableData.push(createData(filteredBills[i].voteRecord.billNumber, vote, filteredBills[i].billData.sponsorName,
          filteredBills[i].billData.dateVoted, filteredBills[i].voteRecord.name, filteredBills[i].billData.link))
    }
    if(filteredBills.length > 0){
      setRows(tableData);
    }
    }

    return (
        <div>
          <Card className={classes.card}>
            <CardHeader
                avatar={setCardLogo()}
                action={
                  <div>
                    <IconButton aria-label='settings' onClick={() => setOpenDeleteDialog(true)}>
                      <IndeterminateCheckBoxIcon color='primary'/>
                    </IconButton>
                  </div>
                }
                title={props.title}
            />
            <DeleteCategoryDialog
                classes={{paper: classes.paper}}
                keepMounted
                open={openDeleteDialog}
                index={props.id}
                onClose={handleDeleteDialogClose}
                value={confimedDeletion}
                categoryName={props.title}
            />
            <CardContent>
              <ChartCard title='MP Voting Distribution'> <RadarChart/> </ChartCard>
              {rows.length > 0 ? (
              <Table className={classes.table} size='small' >
                <TableHead>
                  <TableRow>
                    <TableCell>Bill Name</TableCell>
                    <TableCell align='right'>Vote</TableCell>
                    <TableCell align='right'>Bill Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                      <TableRow key={row.name} >
                        <TableCell component='th' scope='row'>
                          {row.name}
                        </TableCell>
                        <TableCell align='right'>{row.vote}</TableCell>
                        <TableCell align='right'><Button variant="contained" color="primary" onClick={handleBillClickOpen}>
                          VIEW
                        </Button></TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>) : <p>no data for this category</p>}
            </CardContent>
            <CardActions disableSpacing>
              <IconButton onClick={handleClickOpenCompare}>
                <CompareArrowsIcon color='primary'/>
              </IconButton>
              <IconButton>
                <PieChartIcon color='primary'/>
              </IconButton>
              <IconButton onClick={handleClickOpen}>
                <FontAwesomeIcon icon={faHandshake} color='#43D0C4'/>
              </IconButton>
            </CardActions>
          </Card>
          <Dialog
              open={openCompare}
              onClose={handleCloseCompare}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>Head to Head</DialogTitle>
            <DialogContent>
              <h1>Head to head chart goes here</h1>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCompare} color='primary' autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>Bipartisan Index</DialogTitle>
            <DialogContent>
              <ChartCard title='Bipartisan Index'> <BarChartWrapper/> </ChartCard>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color='primary' autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    )
  }
