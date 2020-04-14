import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
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
import { capitalizedName } from './Utilities/CommonUsedFunctions'

const useStyles = makeStyles({
  avatar: {
    backgroundColor: '#00BCD4'
  }
})

export default function BillDialog (props) {
  const classes = useStyles()
  const { onClose, selectedValue, open } = props
  const handleClose = () => {
    onClose(selectedValue)
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle id='simple-dialog-title'>Bill Details</DialogTitle>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <DescriptionIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>{props.billInfo.name}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <HelpIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>{props.billInfo.desc}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <LinkIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Link href={props.billInfo.link} target='_blank' rel='noopener'>
              {props.billInfo.link}
            </Link>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>Sponsored by {capitalizedName(props.billInfo.sponsor)}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <CalendarTodayIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>Voted on {props.billInfo.date}</ListItemText>
        </ListItem>
      </List>
    </Dialog>
  )
}
