import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  bigAvatar: {
    marginLeft: theme.spacing(6),
    width: 100,
    height: 100,
    border: '3px solid #00bcd4'
  },
  bigAvatarXL: {
    marginLeft: theme.spacing(10),
    width: 100,
    height: 100,
    border: '3px solid #00bcd4'
  }
}))

export default function RepresentativeImage (props) {
  const classes = useStyles()
  return (
    <div>
      {props.representative && (
        <Avatar
          alt={props.representative.name}
          src={props.representative.imageUrl}
          className={classes.bigAvatar}
        />
      )}
    </div>
  )
}
