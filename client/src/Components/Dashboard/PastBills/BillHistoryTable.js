import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import CircularProgress from '@material-ui/core/CircularProgress'
import TableRow from '@material-ui/core/TableRow'
import BillDetails from './BillDetails'
import clsx from 'clsx'
import { fetchRepresentative, fetchUserRiding } from '../Utilities/CommonUsedFunctions'
import axios from 'axios'
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton
} from '@material-ui/core'
import DescriptionDialog from '../../MyMP/DescriptionDialog'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { Transition } from '../General/GeneralDashboard'

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
}))

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

export default function BillHistoryTable (props) {
  const { className, ...rest } = props
  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [open, setOpen] = React.useState(false)
  const content = {
    title: 'Bill History Table',
    body: 'This table shows all the bills for this current parliament, ' +
        'including bills number,' +
        " bill's type,date voted, your current MP's vote." +
        ' You can also find more details by clicking on More Details button '
  }
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const [user, setUser] = React.useState(null)
  useEffect(() => {
    if(!user){
      // eslint-disable-next-line no-undef
      const usr = JSON.parse(localStorage.getItem('user'))
      setUser(usr)
    }
  },[user])

  const [representative, setRepresentative] = React.useState(null)
  useEffect(() => {
    async function getData() {
      if(user && !representative) {
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
                  .map((row, i) => {
                    return (
                      <TableRow
                        hover
                        role='checkbox'
                        tabIndex={-1}
                        key={i}
                      >
                        {columns.map((column, i) => {
                          const value = row[column.id]
                          return (
                            <TableCell key={i} align={column.align}>
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
