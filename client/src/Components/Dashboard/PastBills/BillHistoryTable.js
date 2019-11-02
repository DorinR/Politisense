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
import { Firestore } from '../../../Firebase'

const columns = [
  { id: 'billNumber', label: 'Bill Number', minWidth: 100 },
  { id: 'voteDate', label: 'Date Voted', minWidth: 100 },
  {
    id: 'billSubject',
    label: 'Bill Subject',
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

function createData(billNumber, voteDate, billSubject, moreInfo) {
  return { billNumber, voteDate, billSubject, moreInfo }
}

const rows = [
  createData('No. 1377', '2019.06.19', 'The Bill Summary', <BillDetails />),
  createData('China', 'CN', 'The Bill Summary', <BillDetails />),
  createData('Italy', 'IT', 'The Bill Summary', <BillDetails />),
  createData('United States', 'US', 'The Bill Summary', <BillDetails />),
  createData('Canada', 'CA', 'The Bill Summary', <BillDetails />),
  createData('Australia', 'AU', 'The Bill Summary', <BillDetails />),
  createData('Germany', 'DE', 'The Bill Summary', <BillDetails />),
  createData('Ireland', 'IE', 'The Bill Summary', <BillDetails />),
  createData('Mexico', 'MX', 'The Bill Summary', <BillDetails />),
  createData('Japan', 'JP', 'The Bill Summary', <BillDetails />),
  createData('France', 'FR', 'The Bill Summary', <BillDetails />),
  createData('United Kingdom', 'GB', 'The Bill Summary', <BillDetails />),
  createData('Russia', 'RU', 'The Bill Summary', <BillDetails />),
  createData('Nigeria', 'NG', 'The Bill Summary', <BillDetails />),
  createData('Brazil', 'BR', 'The Bill Summary', <BillDetails />)
]

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto'
  }
})

export default function BillHistoryTable() {
  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [userPostalCode, setUserPostalCode] = React.useState('')
  const [userRiding, setUserRiding] = React.useState('')
  const [userRepresentative, setUserRepresentative] = React.useState('')
  const [
    representativeVotingRecord,
    setRepresentativeVotingRecord
  ] = React.useState('')

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem('userToken')) // not working for now but will be added

    let user = {
      email: 'cap1@gmail.com'
    }

    // get the user's riding
    axios
      .get(`/api/users/${user.email}`)
      .then(res => {
        if (res.data.success) {
          let postalCode = res.data.data.postalCode
          let riding = res.data.data.riding
          setUserPostalCode(postalCode)
          setUserRiding(riding)
          // console.log(postalCode)
        }
      })
      .catch(err => console.log(err))

    // get the MP for that riding
    axios
      .get('/api/representatives/riding', {
        riding: userRiding
      })
      .then(res => {
        if (res.data.success) {
          // console.log(res.data.data)
          let representative = res.data.data.representative
          setUserRepresentative(representative)
        }
      })
      .catch(err => console.log(err))

    axios
      .get('api/voteRecord/getVotesByRepresentative', {
        representative: userRepresentative
      })
      .then(res => {
        if (res.data.success) {
          console.log(res.data.data)
          setRepresentativeVotingRecord(res.data.data)
        }
      })
      .catch(err => console.log(err))
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
