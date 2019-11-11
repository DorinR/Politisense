import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  }
})

function createData (name, id, vote) {
  return { name, id, vote }
}
const rows = [
  createData('Bill 101', 159, 'Yes'),
  createData('Bill 102', 237, 'No'),
  createData('Bill 103', 262, 'Abstain'),
  createData('Bill 104', 305, 'Yes'),
  createData('Bill 105', 356, 'No')
]
export default function SimpleTable () {
  const classes = useStyles()
  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Bill Name</TableCell>
            <TableCell align='right'>Bill ID</TableCell>
            <TableCell align='right'>Vote</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell component='th' scope='row'>
                {row.name}
              </TableCell>
              <TableCell align='right'>{row.id}</TableCell>
              <TableCell align='right'>{row.vote}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
