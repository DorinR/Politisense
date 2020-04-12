import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import BillDetails from './BillDetails'
import clsx from 'clsx'
import axios from 'axios'
import {
  TableSortLabel,
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton
} from '@material-ui/core'

import DescriptionDialog from '../../MyMP/DescriptionDialog'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { Transition } from '../General/GeneralDashboard'
import CircularProgress from '@material-ui/core/CircularProgress'

const columns = [
  { id: 'number', label: 'Bill Number', minWidth: 120 },
  { id: 'dateVoted', label: 'Date Voted', minWidth: 120 },
  {
    id: 'title',
    label: 'Bill Title',
    minWidth: 200,
    align: 'left'
  },
  { id: 'vote', label: 'Vote', minWidth: 80 },
  {
    id: 'moreInfo',
    label: 'Details',
    minWidth: 170,
    align: 'right'
  }
]

function createData (number, dateVoted, title, vote, moreInfo) {
  return { number, dateVoted, title, vote, moreInfo }
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  tableWrapper: {
    maxHeight: 410,
    overflow: 'auto'
  },
  container: {
  },
  content: {
    padding: 0
  },
  inner: {
    minWidth: 800
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
  title: {
    color: '#263238',
    fontSize: '16px',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 700
  }
<<<<<<< Updated upstream
}))

async function votingHistory (representative) {
  return axios.get(`api/representatives/representative/voting-history/${representative}`)
=======
})

export async function fetchUserRiding (userEmail) {
  let result = ''
  await axios
    .get(`/api/users/${userEmail}/getUser`, {
      params: { billhistory: userEmail }
    })
    .then(res => {
      if (res.data.success) {
        const riding = res.data.data.riding
        result = riding
      }
    })
    .catch(err => console.log(err))
  return result
}

export async function fetchRepresentative (riding) {
  let result = ''
  await axios
    .get(`/api/representatives/${riding}/getRepresentative`)
    .then(res => {
      if (res.data.success) {
        const representative = res.data.data.name
        result = representative
      }
    })
    .catch(err => console.log(err))
  return result
}

export async function fetchRepresentatieVotes (representative) {
  const result = []
  await axios
    .get(`/api/voteRecord/getVotesByRepresentative/${representative}`)
    .then(res => {
      if (res.data.success) {
        const votes = res.data.data
        votes.forEach(vote => result.push(vote))
      }
    })
    .catch(err => console.log(err))
  return result
}

export function fetchAllBills () {
  return axios
    .get('/api/bills/getAllBills')
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

export async function fetchRepresentativeId (representative) {
  return axios
    .get(`/api/representatives/${representative}/getRepresentativeId`)
>>>>>>> Stashed changes
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
      return []
    })
    .catch(console.error)
}

<<<<<<< Updated upstream
=======
export async function fetchRepresentativeVotes (representativeId) {
  return axios
    .get(`/api/votes/${representativeId}/getAllVotesByRepresentative`)
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
}

export async function fetchAllVoteRecords () {
  return axios.get('/api/voteRecord/getAllVoteRecords').then(res => {
    if (res.data.success) {
      return res.data.data
    }
  })
}

>>>>>>> Stashed changes
function generateTableRows (bills) {
  return bills.map(bill => {
    const { number, dateVoted, title, sponsorName, link, vote, name } = bill
    return createData(
      number,
      dateVoted,
      name.split(',')[0],
      (vote === true ? 'Yea' : 'Nay'),
      <BillDetails
        title={title}
        sponsor={sponsorName}
        linkToFullText={link}
        billNumber={number}
        dateVoted={dateVoted}
      />
    )
  })
}

function descendingComparator (a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator (order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort (array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

export default function BillHistoryTable (props) {
  const { className, ...rest } = props
  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [open, setOpen] = React.useState(false)
  const content = {
    title: 'Voting History',
    body: 'Explore the detailed voting record of your representative. This table ' +
      'contains every vote in which your representative has participated.'
  }
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  const [order, setOrder] = React.useState('desc')
  const [orderBy, setOrderBy] = React.useState('dateVoted')
  const onRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const [rows, setRows] = React.useState([])
  useEffect(() => {
    async function getData () {
      if (rows.length === 0 && props.representative) {
        const bills = await votingHistory(props.representative.name)
        const rows = generateTableRows(bills)
        setRows(rows)
      }
    }
    getData()
  }, [rows, props.representative])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(event.target.value)
    setPage(0)
  }

  return (
    <div className={classes.container}>
      {rows.length === 0 ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <Card
          {...rest}
          className={clsx(classes.root, className)}
        >
          <CardHeader
            classes={{
              title: classes.title
            }}
            title='Voting History'
            action={
              <IconButton aria-label='settings' onClick={handleClickOpen}>
                <HelpOutlineIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent className={classes.content}>
            <div className={classes.tableWrapper}>
              <Table stickyheader='true'>
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableCell
                        key={index}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {index < columns.length - 1 ? (
                          <TableSortLabel
                            active={orderBy === column.id}
                            direction={orderBy === column.id ? order : 'asc'}
                            onClick={createSortHandler(column.id)}
                          >
                            {column.label}
                          </TableSortLabel>
                        ) : (
                        `${column.label}`
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role='checkbox'
                          tabIndex={-1}
                          key={index}
                        >
                          {columns.map(column => {
                            const value = row[column.id]
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number'
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component='div'
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'previous page'
              }}
              nextIconButtonProps={{
                'aria-label': 'next page'
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </CardContent>
          <DescriptionDialog
            open={open}
            onClose={handleClose}
            d3
            explaination={content}
            transition={Transition}
          />
        </Card>)}
    </div>
  )
}
