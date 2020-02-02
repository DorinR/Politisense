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

let rows = []

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
  tableWrapper: {
    maxHeight: 450,
    overflow: 'auto'
  }
})

export async function fetchUserRiding (userEmail) {
  let result = ''
  await axios
    .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
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
    .get(
      `http://localhost:5000/api/representatives/${riding}/getRepresentative`
    )
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
    .get(
      `http://localhost:5000/api/voteRecord/getVotesByRepresentative/${representative}`
    )
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
    .get('http://localhost:5000/api/bills/getAllBills')
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

export async function fetchRepresentativeId (representative) {
  return axios
    .get(
      `http://localhost:5000/api/representatives/${representative}/getRepresentativeId`
    )
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

export async function fetchRepresentativeVotes (representativeId) {
  return axios
    .get(
      `http://localhost:5000/api/votes/${representativeId}/getAllVotesByRepresentative`
    )
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
}

export async function fetchAllVoteRecords () {
  return axios
    .get('http://localhost:5000/api/voteRecord/getAllVoteRecords')
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
}

function generateTableRows (bills) {
  rows = []
  bills.forEach(bill => {
    const { number, dateVoted, title, sponsorName, link, vote } = bill
    const tableRow = createData(
      number,
      dateVoted,
      title,
      vote,
      <BillDetails
        title={title}
        sponsor={sponsorName}
        linkToFullText={link}
        billNumber={number}
        dateVoted={dateVoted}
      />
    )
    rows.push(tableRow)
  })
}

function assembleBillObjects (bills, voteRecords, votesByRepresentative) {
  bills.forEach(bill => {
    bill.vote = getRepresentativeVote(
      bill.id,
      voteRecords,
      votesByRepresentative
    )
  })

  return bills
}

function getRepresentativeVote (billNumber, voteRecords, votesByRepresentative) {
  let targetVoteRecord = {}
  voteRecords.forEach(voteRecord => {
    if (voteRecord.bill === billNumber) {
      targetVoteRecord = voteRecord
    }
  })
  let targetBillVote = null
  votesByRepresentative.forEach(vote => {
    if (vote.vote === targetVoteRecord.id) {
      targetBillVote = vote.yea
    }
  })
  let vote = 'Nay'
  if (targetBillVote) {
    vote = 'Yea'
  }
  if (targetBillVote == null) {
    vote = 'Unknown'
  }

  return vote
}

export default function BillHistoryTable () {
  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  useEffect(() => {
    async function getData () {
      // eslint-disable-next-line no-undef
      const user = JSON.parse(localStorage.getItem('user'))
      const { email } = user
      const riding = await fetchUserRiding(email)
      // eslint-disable-next-line
      const representative = await fetchRepresentative(riding)
      const representativeId = await fetchRepresentativeId(representative)
      const votesByRepresentative = await fetchRepresentativeVotes(
        representativeId
      )
      const bills = await fetchAllBills()
      const voteRecords = await fetchAllVoteRecords()
      const fullBills = assembleBillObjects(
        bills,
        voteRecords,
        votesByRepresentative
      )
      generateTableRows(fullBills)
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
