import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import GavelIcon from '@material-ui/icons/Gavel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBalanceScale, faPrayingHands } from '@fortawesome/free-solid-svg-icons'
import Button from '@material-ui/core/Button'
import DeleteCategoryDialog from './DeleteCategoryDialog'
import Typography from '@material-ui/core/Typography'
import TableContainer from '@material-ui/core/TableContainer'
import BillDialog from './BillDialog'
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
  container: {
    maxHeight: 200
  }
}))

export function createData (name, vote, sponsor, date, desc, link) {
  return { name, vote, sponsor, date, desc, link }
}

export async function populateTable (data, title) {
  const bills = data
  const filteredBills = []
  for (let i = 0; i < bills.length; i++) {
    if (bills[i].billData.category.trim().localeCompare(title.toLowerCase().trim()) === 0) {
      filteredBills.push(bills[i])
    }
  }
  const tableData = []
  for (let i = 0; i < filteredBills.length; i++) {
    let vote = ''
    if (filteredBills[i].voteRecord.paired) {
      vote = 'abstain'
    } else if (filteredBills[i].voteRecord.yea) {
      vote = 'yea'
    } else {
      vote = 'nay'
    }
    tableData.push(createData(filteredBills[i].voteRecord.billNumber, vote, filteredBills[i].billData.sponsorName,
      filteredBills[i].billData.dateVoted, filteredBills[i].voteRecord.name, filteredBills[i].billData.link))
  }
  if (filteredBills.length > 0) {
    return tableData
  }
}

export default function CategoryCard (props) {
  const classes = useStyles()
  const [title, setTitle] = React.useState('')
  const [data, setData] = React.useState([])
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
  const [confimedDeletion] = React.useState(false)
  const [rows, setRows] = React.useState([])
  const [billInfo, setBillInfo] = React.useState([])
  const [billOpen, setBillOpen] = React.useState(false)

  const handleDeleteDialogClose = (newValue, index) => {
    if (newValue === true) {
      props.delete(index)
      setRows([])
    }
    setOpenDeleteDialog(false)
  }
  const handleBillClickOpen = (row) => {
    setBillInfo(row)
    setBillOpen(true)
  }

  const handleBillClose = () => {
    setBillOpen(false)
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
    populateTable(props.representative, props.title).then(rows => {
      setRows(rows)
    })
    setTitle(props.title)
    setData(props.data)
  }, [props.title,props.data, props.representative])


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
          categoryName={props.title}
        />
        <CardContent>
          {data.length
            ? <BarChartWrapper data={data} categoryType={props.title} />
            : 'title is empty!!'}
          <TableContainer className={classes.container}>
          <Table className={classes.table} size='small' aria-label='a dense table'>
            <TableHead>
              <TableRow>
                <TableCell>Bill Name</TableCell>
                <TableCell align='right'>Vote</TableCell>
              </TableRow>
            </TableHead>
            {(rows && rows.length) > 0 ? (
                <TableBody stickyHeader >
                  {rows.map(row => (
                    <TableRow key={row.name}>
                      <TableCell component='th' scope='row'>
                        <Button color='primary' onClick={() => handleBillClickOpen(row)}><Typography>{row.name}</Typography></Button>
                      </TableCell>
                      <TableCell align='right'>{row.vote === 'yea' ? <Typography>Yea</Typography> : <Typography>Nay</Typography>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>) : ''}
          </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <BillDialog billInfo={billInfo} open={billOpen} onClose={handleBillClose} />
    </div>
  )
}
