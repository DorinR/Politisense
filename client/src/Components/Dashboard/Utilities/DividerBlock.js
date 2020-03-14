import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import InfoBubble from './InfoBubble'

const useStyles = makeStyles(theme => ({
  customBackground: {
    padding: '5px 0px',
    margin: '10px 0px',
    borderRadius: '10px'
  },
  customTypographyFont: {
    color: 'white',
    fontWeight: 'bold'
  },
  infoBubblePlacement: {
    borderTop: '1px solid transparent'
  }
}))

export default function DividerBlock (props) {
  const classes = useStyles()

  return (
    <div
      className={classes.customBackground}
      style={{ backgroundColor: props.color }}
    >
      <span style={{ display: '-webkit-inline-box' }}>
        <Typography variant='h6' className={classes.customTypographyFont}>
          {props.text}
        </Typography>
        <span className={classes.infoBubblePlacement}>
          {props.infoBubbleText && (
            <InfoBubble
              title={props.infoBubbleTitle}
              text={props.infoBubbleText}
              color={props.infoBubbleColor}
            />
          )}
        </span>
      </span>
    </div>
  )
}
