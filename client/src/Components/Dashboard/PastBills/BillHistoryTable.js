import React, { useState, useEffect } from 'react'
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
    id: 'billSummary',
    label: 'Bill Summary',
    minWidth: 200,
    align: 'right'
  },
  {
    id: 'moreInfo',
    label: 'Details',
    minWidth: 170,
    align: 'right'
  }
]

function createData(billNumber, voteDate, billSummary, moreInfo) {
  return { billNumber, voteDate, billSummary, moreInfo }
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

var userRiding = ''
var userRepresentative = ''
var userRepresentativeVotes = []
var testingVotesToDisplay = [
  { vote: 'this is the vote text' },
  { vote: 'this is the vote text of another vote' }
]

async function fetchUserRiding(userEmail) {
  console.log('call 1')
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
  return result
}

async function fetchRepresentative(riding) {
  console.log('call 2')
  let result = ''
  await axios
    .get(
      `http://localhost:5000/api/representatives/${riding}/getRepresentative`
    )
    .then(res => {
      if (res.data.success) {
        let representative = res.data.data.representative
        result = representative
      }
    })
    .catch(err => console.log(err))
  return result
}

async function fetchRepresentativeVotes(representative) {
  console.log('call 3')
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
  votes.forEach(vote => {
    let { billNumber, dateVoted, voteName, billSummary, billText } = vote
    let tableRow = createData(
      billNumber,
      dateVoted,
      voteName,
      <BillDetails billSummary={billSummary} billText={billText} />
    )
    rows.push(tableRow)
  })
}

function displayVotes() {
  console.log(JSON.stringify(testingVotesToDisplay))
}

export default function BillHistoryTable() {
  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [userRiding, setUserRiding] = React.useState('')
  const [userRepresentative, setUserRepresentative] = React.useState('')
  const [
    representativeVotingRecord,
    setRepresentativeVotingRecord
  ] = React.useState('')

  useEffect(() => {
    async function getData() {
      let userEmail = 'cap1@gmail.com'
      let riding = await fetchUserRiding(userEmail)
      console.log('riding from the use effect function: ' + riding)
      let representative = await fetchRepresentative(riding)
      console.log(
        'representative from the use effect function: ' + representative
      )
      let votes = await fetchRepresentativeVotes(representative)
      generateTableRows(votes)
      // console.log('votes from the use effect function: ' + votes)
    }

    getData()

    // let userEmail = 'cap1@gmail.com'
    // let res = fetchUserRiding(userEmail)
    // console.log(res)
    // console.log(res)
    // setUserRiding(res)
  }, [])

  // useEffect(() => {
  //   fetchRepresentative()
  // }, [])

  // useEffect(() => {
  //   fetchRepresentativeVotes()
  // }, [])

  // useEffect(() => {
  //   displayVotes()
  // }, [])

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
        <h1>{userRiding}</h1>
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
