import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    padding: '10px 8px',
    justifyContent: 'flex-start',
    fontWeight: theme.typography.fontWeightMedium,
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: 'white',
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: 'white'
    }
  }
}))

const SidebarNav = props => {
  const { pages, className, ...rest } = props

  const classes = useStyles()

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {pages.map(page => (
        <ListItem
          button
          className={classes.item}
          activeClassName={classes.active}
          disableGutters
          to={page.href}
          component={Link}
          key={page.title}
        >
          <ListItemIcon activeClassName={classes.active} className={classes.icon}>{page.icon} </ListItemIcon>
          <ListItemText className={classes.icon}>{page.title}</ListItemText>
        </ListItem>
      ))}
    </List>
  )
}

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
}

export default SidebarNav
