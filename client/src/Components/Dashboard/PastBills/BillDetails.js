import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
})

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent)

export default function BillDetails() {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button variant='outlined' color='secondary' onClick={handleClickOpen}>
        View Details
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
      >
        <DialogTitle id='customized-dialog-title' onClose={handleClose}>
          C-48 — An Act respecting the regulation of vessels that transport
          crude oil or persistent oil to or from ports or marine installations
          located along British Columbia's north coast
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            That a Message be sent to the Senate to acquaint Their Honours that,
            in relation to Bill C-48, An Act respecting the regulation of
            vessels that transport crude oil or persistent oil to or from ports
            or marine installations located along British Columbia's north
            coast, the House: agrees with amendment 1 made by the Senate;
            proposes that, as a consequence of Senate amendment 1, the following
            amendment be added: “1. Clause 2, page 1: add the following after
            line 15: “Indigenous peoples of Canada has the meaning assigned by
            the definition aboriginal peoples of Canada in subsection 35(2) of
            the Constitution Act, 1982. (peuples autochtones du Canada)”;”;
            proposes that amendment 2 be amended by replacing the text of the
            amendment with the following: “32 (1) During the fifth year after
            the day on which this section comes into force, a review of the
            provisions and operation of this Act must be undertaken by any
            committee of the Senate, of the House of Commons or of both Houses
            of Parliament that is designated or established for that purpose,
            including a review of the impact of this Act on the environment, on
            social and economic conditions and on the Indigenous peoples of
            Canada. (2) The committee referred to in subsection (1) must submit
            a report of the results of the review to the Senate, the House of
            Commons or both Houses of Parliament, as the case may be, on any of
            the first 15 days on which the Senate or the House of Commons, as
            the case may be, is sitting after the report is completed.”
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  )
}
