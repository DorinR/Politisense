import React from 'react'
import { withRouter } from 'react-router-dom'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import {
  AppBar, Toolbar, IconButton,
  Typography, ListItem, List
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import InputIcon from '@material-ui/icons/Input'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    backgroundColor: '#00bcd4'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  avatar: {
    backgroundColor: 'white',
    color: 'white',
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32,
    color: 'white'

  },
  routerLink: {
    textDecoration: 'none',
    color: 'white'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: 'none'
  }

}))

const flexContainer = {
  display: 'flex',
  flexDirection: 'row',
  padding: 0
}

const Topbar = withRouter((props) => {
  const { className, onSidebarOpen } = props
  const classes = useStyles()
  return (
    <AppBar
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <div>
          <List style={flexContainer}>
            <ListItem>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={onSidebarOpen}
                edge='start'
              >
                <MenuIcon />
              </IconButton>
            </ListItem>
            {props.open === false
              ? (
                <ListItem button onClick={() => { props.history.push({ pathname: '/general' }) }}>
                  <AccountBalanceIcon className={classes.icon} />
                  <Typography variant='h6' style={{ color: 'white' }}>Politisense</Typography>
                </ListItem>
              )
              : (
                <ListItem>
                  <AccountBalanceIcon className={classes.icon} />
                  <Typography variant='h6' style={{ color: 'white' }}>Politisense</Typography>
                </ListItem>
              )}
          </List>
        </div>

        <div className={classes.flexGrow} />
        <Button
          style={{ color: 'white', textTransform: 'none' }} variant='text'
          onClick={() => { props.history.push('/general') }}
        >General
        </Button>
        <Button
          style={{ color: 'white', textTransform: 'none' }} variant='text'
          onClick={() => { props.history.push('/myRepresentative') }}
        >My MP
        </Button>
        <Button
          style={{ color: 'white', textTransform: 'none' }} variant='text'
          onClick={() => { props.history.push('/compare') }}
        >Head To Head
        </Button>
        <Button
          style={{ color: 'white', textTransform: 'none' }} variant='text'
          onClick={() => { props.history.push('/map') }}
        >Map
        </Button>
        {props.country && props.country === 'Canada'
          ?
          <Button
            style={{ color: 'white', textTransform: 'none' }} variant='text'
            onClick={() => { props.history.push('/polls') }}
          >
            Polls
              </Button> : ''}
        <IconButton
          className={classes.signOutButton}
          onClick={() => { props.history.push('/logout') }}
        >
          <InputIcon style={{ color: 'white' }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
})

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
}

export default Topbar
