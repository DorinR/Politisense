import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardActionArea,
  Button,
  Divider,
  IconButton
} from '@material-ui/core'
import Radar from 'react-d3-radar'
import BillDialog from '../Dashboard/BillDialog'
import DescriptionDialog from './DescriptionDialog'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import TableDialog from './TableDialog'
import Slide from '@material-ui/core/Slide'

export const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})
const useStyles = makeStyles((theme) => ({
  root: {
    height: '`calc(100% - 1px)%'
  },
  content: {
    padding: 0
  },
  image: {
    height: 48,
    width: 48
  },
  title: {
    color: '#263238',
    fontSize: '16px',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 700
  },
  actions: {
    justifyContent: 'flex-end'
  }
}))

const MPActivityDistribution = props => {
  const { className, ...rest } = props
  const classes = useStyles()
  const [billInfo] = React.useState([])
  const [billOpen, setBillOpen] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [tableDialogOpen, setTableDialogOpen] = React.useState(false)
  const [tableContents, setTableContents] = React.useState([])

  const handleBarPieChartClickOpen = (rows) => {
    setTableContents(rows)
    setTableDialogOpen(true)
  }
  const handleBarPieChartClose = () => {
    setTableDialogOpen(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleBillClose = () => {
    setBillOpen(false)
  }

  return (
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
            <HelpOutlineIcon onClick={handleClickOpen} />
          </IconButton>
        }
        title="MP's Activity Distribution"
      />
      <Divider />
      <CardContent>
        <CardActionArea>
          <div className={classes.chartContainer}>
            <Radar
              width={400}
              height={400}
              padding={30}
              domainMax={props.radarData[1]}
              highlighted
              onHover={point => {
                if (point) {
                } else {
                }
              }}
              data={{
                variables: createVariablesRadar(props.categoryList),
                sets: [
                  {
                    values: props.radarData[0]
                  }
                ]
              }}
              size={400}
              style={classes.title}
            />
          </div>
        </CardActionArea>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button style={{ fontWeight: 40, textTransform: 'none' }} onClick={() => handleBarPieChartClickOpen(props.rows)}>
                    show more
        </Button>
      </CardActions>
      <TableDialog
        rows={tableContents}
        open={tableDialogOpen}
        onClose={handleBarPieChartClose}
        type='radar'
        transition={Transition}
      />
      <BillDialog billInfo={billInfo} open={billOpen} onClose={handleBillClose} transition={Transition} />
      <DescriptionDialog
        open={open}
        onClose={handleClose}
        d3
        explaination={{
          title: 'Mp Activity Distribution',
          body: 'From this radar chart,' +
                        " we can measure the MP's activity in the parliament as well as which " +
                        'categories he/she are most active with, such as religion, economics, human right etc.'
        }}
        transition={Transition}
      />
    </Card>
  )
}

MPActivityDistribution.propTypes = {
  className: PropTypes.string
}

export default MPActivityDistribution

export function createVariablesRadar (categories) {
  const lables = []
  categories.forEach(category => {
    const temp = { key: category, label: category }
    lables.push(temp)
  })
  return lables
}
