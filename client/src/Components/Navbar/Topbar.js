import React from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import {
  AppBar, Toolbar, Hidden, IconButton, Grid,
  Typography,
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
    flexGrow: 2
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

const Topbar = props => {
  const { className, open, onSidebarOpen, ...rest } = props

  const classes = useStyles()

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <div>
          <Grid container direction='row' alignItems='center'>
            <Grid item className={classes.flexGrow}>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={onSidebarOpen}
                edge='start'
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Link to='/general' className={classes.routerLink}>
              <Grid item>
                <AccountBalanceIcon className={classes.icon} />
              </Grid>
            </Link>
            <Link to='/general' className={classes.routerLink}>
              <Grid item>
                <Typography variant='h6' color='white'> Politisense </Typography>
              </Grid>
            </Link>
          </Grid>
        </div>

        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <Button
            style={{ color: 'white', textTransform: 'none' }} variant='text'
            component={Link}
            to='/general'
          >General
          </Button>
          <Button
            style={{ color: 'white', textTransform: 'none' }} variant='text'
            component={Link}
            to='/myRepresentative'
          >My MP
          </Button>
          <Button
            style={{ color: 'white', textTransform: 'none' }} variant='text'
            component={Link}
            to='/compare'
          >Head To Head
          </Button>
          <Button
            style={{ color: 'white', textTransform: 'none' }} variant='text'
            component={Link}
            to='/map'
          >Map
          </Button>
          <IconButton
            className={classes.signOutButton}
          >
            <Link to='/logout' className={classes.routerLink}>
              <InputIcon style={{ color: 'white' }} />
            </Link>
          </IconButton>
        </Hidden>

      </Toolbar>
    </AppBar>
  )
}

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
}

export default Topbar