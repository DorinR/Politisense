import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import { Timeline, TimelineItem } from 'vertical-timeline-component-for-react'
import { Card, Grid, CardContent, Divider } from '@material-ui/core'
import BarChartWrapper from '../Dashboard/Charts/Wrappers/BarChartWrapper'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import Button from '@material-ui/core/Button'
import BillDialog from '../Dashboard/BillDialog'
import { capitalizedName, loadingTextTitle, loadingTextdata } from '../Dashboard/Utilities/CommonUsedFunctions'
import TextField from '@material-ui/core/TextField'

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (<IconButton aria-label='close' className={classes.closeButton} onClick={onClose}><CloseIcon /></IconButton>) : null}
    </MuiDialogTitle>)
})

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)

  }
}))(MuiDialogContent)

const DescriptionDialog = (props) => {
  const { onClose, selectedValue, open } = props
  const [billInfo, setBillInfo] = React.useState([])
  const [billOpen, setBillOpen] = React.useState(false)

  const handleBillClose = () => {
    setBillOpen(false)
  }
  const handleCloseDialog = () => {
    onClose(selectedValue)
  }

  const handleBillClickOpen = (row, type) => {
    if (row && type === 'bar-pie') {
      const billInfo = {
        name: row.bill.billsClassified.number,
        desc: row.bill.billsClassified.title,
        link: row.bill.billsClassified.link,
        sponsor: row.bill.billsClassified.sponsorName,
        data: row.bill.billsClassified.dateVoted
      }
      setBillInfo(billInfo)
      setBillOpen(true)
    }
  }
  const handleFilterChange = e => {
    setFilter(e.target.value)
  }
  const [filter, setFilter] = React.useState('')
  const [filteredRowsByCategory, setFilteredRowsByCategory] = React.useState([])

  useEffect(() => {
    let filteredRowsByCategory
    if (filter === '') {
      filteredRowsByCategory = props.rows
    } else {
      filteredRowsByCategory = props.rows.filter(row => row.category.toLowerCase().includes(filter.toLowerCase()))
    }
    setFilteredRowsByCategory(filteredRowsByCategory)
  }, [filter, props.rows])

  return (
    <div>
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby='customized-dialog-title'
        open={open}
        maxWidth={props.d3Container ? 'md' : 'sm'}
        fullWidth
      >
        <DialogTitle id='customized-dialog-title' onClose={handleCloseDialog}>
          {props.explaination ? props.explaination.title : props.title}
        </DialogTitle>
        <DialogContent>
          {props.d3Container
          // eslint-disable-next-line react/jsx-no-undef
            ? (
              <Grid container>
                <Grid item xs={12} lg={12} sm={10} md={10}>
                  <Card style={{ height: '100%', display: 'flex' }}>
                    <CardContent>
                      <BarChartWrapper type='bar-pie' data={props.userRepIssuedBills} categories={props.categoryList} />
                      <Divider />
                      {filteredRowsByCategory && filteredRowsByCategory.length > 0
                        ? (
                          <TableContainer>
                            <TextField label='Filter by Category' variant='outlined' onChange={handleFilterChange} color='primary' />
                            <Table size='medium' aria-label='simple table'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Bill Name</TableCell>
                                  <TableCell align='right'> Category </TableCell>
                                  <TableCell align='right'>Bill Status</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody stickyHeader>
                                {filteredRowsByCategory.map((row, i) => (
                                  row.bill
                                    ? (
                                      <TableRow key={i}>
                                        <TableCell component='th' scope='row'>
                                          <Button color='primary' onClick={() => handleBillClickOpen(row, 'pie-bar')}>
                                            <Typography>{row.bill.billsClassified.number}</Typography>
                                          </Button>
                                        </TableCell>
                                        <TableCell component='th' scope='row' align='right'><Typography>{row.category}</Typography></TableCell>
                                        <TableCell align='right'><Typography>{row.status} </Typography> </TableCell>
                                      </TableRow>
                                    ) : ('')))}
                              </TableBody>
                            </Table>
                          </TableContainer>)
                        : 'NO data'}
                      <BillDialog billInfo={billInfo} open={billOpen} onClose={handleBillClose} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>)
            : props.d3
              ? (
                <DialogContent>
                  <Typography gutterBottom>
                    {props.explaination.title ? props.explaination.body : 'modal title'}
                  </Typography>
                </DialogContent>)
              : (
                <DialogContent>
                  <Timeline lineColor='#ddd'>
                    {props.data ? props.data.map((element, i) => (

                      <TimelineItem
                        key={i}
                        dateText={loadingTextdata(element)}
                        dateInnerStyle={{ background: '#61b8ff', color: '#000' }}
                        bodyContainerStyle={{
                          background: '#ddd',
                          padding: '20px',
                          borderRadius: '8px',
                          boxShadow: '0.5rem 0.5rem 2rem 0 rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        <h3 style={{ color: '#61b8ff' }}>{capitalizedName(loadingTextTitle(element))}</h3>
                        <p>{element ? element.desc : ''}</p>
                      </TimelineItem>
                    )) : ''}
                  </Timeline>
                </DialogContent>)}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DescriptionDialog
