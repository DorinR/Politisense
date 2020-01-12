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
    // minWidth: 650,
  }
}))

function createData (name, vote) {
  return { name, vote }
}

export default function CategoryCard (props) {
  const classes = useStyles()
  const [openCompare, setOpenCompare] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
  const [confimedDeletion] = React.useState(false)
  const [rows, setRows] = React.useState([])

  const handleDeleteDialogClose = (newValue, index) => {
    console.log('the newValue of the card is ' + newValue)
    console.log('the index of the card is ' + index)

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

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  function setCardLogo () {
    switch (title) {
      case 'Economics':
        return <TrendingUpIcon color='primary' />
      case 'Trade':
        return <TrendingUpIcon color='primary' />
      case 'Business':
        return <BusinessCenterIcon color='primary' />
      case 'Criminal':
        return <GavelIcon color='primary' />
      case 'Religion':
        return <FontAwesomeIcon icon={faPrayingHands} color='#43D0C4' size='lg' />
      case 'Human Rights':
        return <FontAwesomeIcon icon={faBalanceScale} color='#43D0C4' size='lg' />
      default:
        return <IndeterminateCheckBoxIcon color='primary' />
    }
  }

  React.useEffect(() => {
    populateTable()
    // setId(props.id)
    setTitle(props.title)
  }, [props.title])

  async function populateTable () {
    setRows([
      createData('Bill 101', 'Yes'),
      createData('Bill 102', 'No'),
      createData('Bill 103', 'Abstain')
    ])
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardHeader
          avatar={setCardLogo()}
          action={
            <div>
              <IconButton aria-label='settings' onClick={() => setOpenDeleteDialog(true)}>
                <IndeterminateCheckBoxIcon color='primary' />
              </IconButton>
            </div>
          }
          title={props.title}
        />
        <DeleteCategoryDialog
          classes={{ paper: classes.paper }}
          keepMounted
          open={openDeleteDialog}
          index={props.id}
          onClose={handleDeleteDialogClose}
          value={confimedDeletion}
        />
        <CardContent>
          <ChartCard title='MP Voting Distribution'> <RadarChart /> </ChartCard>
          <Table className={classes.table} size='small' aria-label='a dense table'>
            <TableHead>
              <TableRow>
                <TableCell>Bill Name</TableCell>
                <TableCell align='right'>Vote</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.name}>
                  <TableCell component='th' scope='row'>
                    {row.name}
                  </TableCell>
                  <TableCell align='right'>{row.vote}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={handleClickOpenCompare}>
            <CompareArrowsIcon color='primary' />
          </IconButton>
          <IconButton>
            <PieChartIcon color='primary' />
          </IconButton>
          <IconButton onClick={handleClickOpen}>
            <FontAwesomeIcon icon={faHandshake} color='#43D0C4' />
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
          <ChartCard title='Bipartisan Index'> <BarChartWrapper /> </ChartCard>
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
