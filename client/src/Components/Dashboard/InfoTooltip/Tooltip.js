import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

export default function VariableWidth (props) {
  return (
    <Tooltip title={props.text}>
      <HelpOutlineIcon
        style={{ marginBottom: '-6px' }}
        color='primary'
        fontSize={props.size}
      />
    </Tooltip>
  )
}
