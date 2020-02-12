import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import DescriptionIcon from '@material-ui/icons/Description'
import List from '@material-ui/core/List'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import HelpIcon from '@material-ui/icons/Help'
import LinkIcon from '@material-ui/icons/Link'
import PersonIcon from '@material-ui/icons/Person'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import Link from '@material-ui/core/Link'
import { capitalizedName } from '../BillDialog'

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
  },
  avatar: {
    backgroundColor: '#43D0C4'
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

const useStyles = makeStyles({
  avatar: {
    backgroundColor: '#43D0C4'
  }
})

export default function BillDetails (props) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button variant='outlined' onClick={handleClickOpen}>
        View Details
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
      >
        <DialogTitle id='simple-dialog-title'>Bill Details</DialogTitle>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <DescriptionIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>{props.billNumber}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <HelpIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>{props.title}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <LinkIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              <Link href={props.linkToFullText} target='_blank' rel='noopener'>
                {props.linkToFullText}
              </Link>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              Sponsored by {capitalizedName(props.sponsor)}
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <CalendarTodayIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>Voted on {props.dateVoted}</ListItemText>
          </ListItem>
        </List>
      </Dialog>
    </div>
  )
}
