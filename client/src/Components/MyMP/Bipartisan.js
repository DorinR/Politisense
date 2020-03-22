import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Divider,
  CardActions
} from '@material-ui/core'
import BarChartWrapper from '../Dashboard/Charts/Wrappers/BarChartWrapper'
import HelpOutlineRoundedIcon from '@material-ui/icons/HelpOutlineRounded'
import DescriptionDialog from './DescriptionDialog'
import Button from '@material-ui/core/Button'
import CardActionArea from '@material-ui/core/CardActionArea'
import TableDialog from './TableDialog'
import { Transition } from '../Dashboard/General/GeneralDashboard'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  chartContainer: {
    position: 'relative',
    height: '100%'
  },
  stats: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center'
  },

  title: {
    color: '#263238',
    fontSize: '16px',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 700
  },
  actions: {
    display: 'relative',
    justifyContent: 'flex-end'
  }
}))
const Bipartisan = props => {
  const { className, ...rest } = props
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [tableDialogOpen, setTableDialogOpen] = React.useState(false)
  const [tableContents, setTableContents] = React.useState([])

  const handleBarPieChartClose = () => {
    setTableDialogOpen(false)
  }

  const handleBarPieChartClickOpen = (rows) => {
    setTableContents(rows)
    setTableDialogOpen(true)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardHeader
          classes={{
            title: classes.title
          }}
          action={
            <IconButton aria-label='settings'>
              <HelpOutlineRoundedIcon onClick={handleClickOpen} />
            </IconButton>
          }
          title='BiPartisan Index'
        />
        <Divider />
        <CardContent>
          <CardActionArea>
            <div className={classes.chartContainer}>
              <BarChartWrapper
                type={props.title}
                data={props.data}
              />
            </div>
          </CardActionArea>
        </CardContent>
        <Divider />
        <CardActions className={classes.actions}>
          <Button style={{ fontWeight: 40, textTransform: 'none' }} onClick={() => handleBarPieChartClickOpen(props.rows)}>
                    show more
          </Button>
          <TableDialog rows={tableContents} open={tableDialogOpen} onClose={handleBarPieChartClose} type='bipartisan'> </TableDialog>
        </CardActions>
        <DescriptionDialog
          open={open}
          onClose={handleClose}
          d3
          explaination={{
            title: 'BiPartisan',
            body: 'The Bipartisan Index measures the frequency with which a Member co-sponsors a bill introduced by the opposite party ' +
                                                  'and the frequency with which a Member’s own bills attract co-sponsors from the opposite party.'
          }}
          transition={Transition}
        />
      </Card>
    </div>

  )
}

Bipartisan.propTypes = {
  className: PropTypes.string
}

export default Bipartisan
