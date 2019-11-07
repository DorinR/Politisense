import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import BillDetails from './BillDetails'
import axios from 'axios'

const columns = [
  { id: 'billNumber', label: 'Bill Number', minWidth: 100 },
  { id: 'voteDate', label: 'Date Voted', minWidth: 100 },
  {
    id: 'billTitle',
    label: 'Bill Title',
    minWidth: 200,
    align: 'right'
  },
  {
    id: 'representativeVote',
    label: 'Representative Vote',
    minWidth: 50,
    align: 'right'
  },
  {
    id: 'moreInfo',
    label: 'Details',
    minWidth: 170,
    align: 'right'
  }
]

function createData(
  billNumber,
  voteDate,
  billTitle,
  representativeVote,
  moreInfo
) {
  return { billNumber, voteDate, billTitle, representativeVote, moreInfo }
}

let rows = []

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto'
  }
})

export async function fetchUserRiding(userEmail) {
  let result = ''
  await axios
    .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
    .then(res => {
      if (res.data.success) {
        let riding = res.data.data.riding
        result = riding
      }
    })
    .catch(err => console.log(err))
  console.log(result)
  return result
}

export async function fetchRepresentative(riding) {
  let result = ''
  await axios
    .get(
      `http://localhost:5000/api/representatives/${riding}/getRepresentative`
    )
    .then(res => {
      if (res.data.success) {
        let representative = res.data.data.name
        result = representative
      }
    })
    .catch(err => console.log(err))
  return result
}

export async function fetchRepresentativeVotes(representative) {
  let result = []
  await axios
    .get(
      `http://localhost:5000/api/voteRecord/getVotesByRepresentative/${representative}`
    )
    .then(res => {
      if (res.data.success) {
        let votes = res.data.data
        votes.forEach(vote => result.push(vote))
      }
    })
    .catch(err => console.log(err))
  return result
}

function generateTableRows(votes) {
  rows = []
  votes.forEach(vote => {
    let {
      billNumber,
      dateVoted,
      voteName,
      representativeVote,
      billTitle,
      billText
    } = vote
    let tableRow = createData(
      billNumber,
      dateVoted,
      voteName,
      representativeVote,
      <BillDetails billTitle={billTitle} billText={billText} />
    )
    rows.push(tableRow)
    console.log(representativeVote)
  })
}

export default function BillHistoryTable() {
  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  useEffect(() => {
    async function getData() {
      let user = JSON.parse(localStorage.getItem('user'))
      let { email } = user
      let riding = await fetchUserRiding(email)
      let representative = await fetchRepresentative(riding)
      let votes = await fetchRepresentativeVotes(representative)
      generateTableRows(votes)
    }
    getData()
  })

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
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
        rowsPerPageOptions={[10, 25, 100]}
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
    </Paper>
  )
}
