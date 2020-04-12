import React, { useEffect } from 'react'
import HelpIcon from '@material-ui/icons/Help'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const useStyles = makeStyles(theme => ({
  help: {
    cursor: 'pointer',
    marginTop: '4px',
    marginLeft: '4px'
  }
}))

export default function InfoBubble(props) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [color, setColor] = React.useState('#43D0C4')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (props.color && props.color !== color) {
      setColor(props.color)
    }
  }, [props.color, color])

  return (
    <span>
      <HelpIcon
        className={classes.help}
        style={{ color: color }}
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
      >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.text}</DialogContentText>
        </DialogContent>
      </Dialog>
    </span>
  )
}
