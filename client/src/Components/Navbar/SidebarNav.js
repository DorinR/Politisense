import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { withRouter } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    padding: '10px 8px',
    justifyContent: 'flex-start',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    color: 'white'
  },
  active: {
    color: 'white',
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: 'white'
    }
  }
}))

const SidebarNav = withRouter((props) => {
  const { pages, className } = props

  const classes = useStyles()

  return (
    <List
      className={clsx(classes.root, className)}
    >
      {pages.map(page => (
        <ListItem
          button
          className={classes.item}
          disableGutters
          onClick={() => { props.history.push(page.href) }}
          key={page.title}
        >
          <ListItemIcon className={classes.icon}>{page.icon}</ListItemIcon>
          <ListItemText className={classes.icon}>{page.title}</ListItemText>
        </ListItem>
      ))}
    </List>
  )
})

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
}

export default SidebarNav
