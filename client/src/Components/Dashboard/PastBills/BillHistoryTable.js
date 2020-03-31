import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import CircularProgress from '@material-ui/core/CircularProgress'
import TableRow from '@material-ui/core/TableRow'
import BillDetails from './BillDetails'
import { fetchRepresentative, fetchUserRiding } from '../Utilities/CommonUsedFunctions'
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

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
  tableWrapper: {
    maxHeight: 450,
    overflow: 'auto'
  },
  container: {
    margin: '20px',
    marginTop: '30px'
  }
})

async function votingHistory(representative){
  return axios.get(`api/representatives/representative/voting-history/${representative}`)
    .then(res => {
      if(res.data.success) {
        return res.data.data
      }
      return []
    })
    .catch(console.error)
}

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

export default function BillHistoryTable () {
  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const [user, setUser] = React.useState(null)
  useEffect(() => {
    if(!user){
      // eslint-disable-next-line no-undef
      console.log('got user')
      const usr = JSON.parse(localStorage.getItem('user'))
      setUser(usr)
    }
  },[user])

  const [representative, setRepresentative] = React.useState(null)
  useEffect(() => {
    async function getData() {
      if(user && !representative) {
        console.log('setting rep now')
        const riding = await fetchUserRiding(user.email)
        const rep = await fetchRepresentative(riding)
        setRepresentative(rep)
      }
    }
    getData()
  },[user, representative])

  const [rows, setRows] = React.useState([])
  useEffect(() => {
    async function getData () {
      if(rows.length === 0 && representative) {
        console.log('setting rows now')
        const bills = await votingHistory(representative)
        console.log('rows set')
        const rows = generateTableRows(bills)
        setRows(rows)
      }
    }
    getData()
  }, [rows, representative])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <div className={classes.container}>
      {rows.length === 0 ? (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              zIndex: '-2',
              transform: 'translate(-50%, -50%)'
            }}>
            <CircularProgress />
          </div>
        ) : (
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
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                  )}
                )}
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
      </Paper>)}
    </div>
  )
}
