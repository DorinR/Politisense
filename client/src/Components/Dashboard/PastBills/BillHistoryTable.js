import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import BillDetails from './BillDetails'

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
