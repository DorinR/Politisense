import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Drawer, Grid, Typography } from '@material-ui/core'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import SettingsIcon from '@material-ui/icons/Settings'
import RepresentativeImage from './Dashboard/Sidebar/RepresentativeImage'
import SidebarNav from './SidebarNav'
import axios from 'axios'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import AppBar from '@material-ui/core/AppBar'
import { Link } from 'react-router-dom'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import MpProfile from './Dashboard/MpProfile'
import Divider from '@material-ui/core/Divider'
import MapIcon from '@material-ui/icons/Map'
import CompareArrowsIcon from '@material-ui/icons/CompareArrows'
import IconButton from '@material-ui/core/IconButton'
import { useTheme } from '@material-ui/core/styles'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

export async function fetchUserRiding (userEmail) {
  return axios
    .get(`/api/users/${userEmail}/getUser`)
    .then(res => {
      if (res.data.success) {
        return res.data.data.riding
      }
    })
    .catch(console.error)
}

export async function fetchRepresentative (riding) {
  return axios
    .get(
      `/api/representatives/${riding}/getRepresentative`
    )
    .then(res => {
      if (res.data.success) {
        return res.data.data.name
      }
    })
    .catch(console.error)
}
const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    backgroundColor: '#1E2125'

  },
  root: {
    backgroundColor: '#1E2125',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    backgroundColor: 'grey',
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  },
  avatar: {
    backgroundColor: 'white',
    color: '#00bcd4',
    height: 56,
    width: 56
  },
  icon: {
    height: 40,
    width: 40,
    color: '#00bcd4'
  },
  routerLink: {
    textDecoration: 'none',
    color: 'WHITE',
    backgroundColor: '#1E2125'
  },
  container: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: '#1E2125',
    textDecoration: 'none',
    color: 'WHITE'

  },
  divider1: {
    backgroundColor: 'grey'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: 'calc(100% - 240px)',
    marginLeft: 240,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -240
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }

}))

const Sidebar = props => {
  const { open, variant, onClose, onSidebarOpen, className, ...rest } = props
  const [userRepresentative, setUserRepresentative] = React.useState(null)
  const [riding, setRiding] = useState(null)
  const [user, setUser] = useState(null)
  const theme = useTheme()

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const user = JSON.parse(localStorage.getItem('user'))
    setUser(user)
  }, [])

  useEffect(() => {
    async function getData () {
      if (user) {
        const riding = await fetchUserRiding(user.email)
        setRiding(riding)
      }
    }
    getData()
  }, [user])

  useEffect(() => {
    async function getData () {
      if (riding) {
        const representative = await fetchRepresentative(riding)
        setUserRepresentative(representative)
      }
    }
    getData()
  }, [riding])
  const classes = useStyles()

  const pages = [
    {
      title: 'General',
      href: '/general',
      icon: <DashboardIcon />
    },
    {
      title: 'My MP',
      href: '/myMp',
      icon: <PeopleIcon />
    },
    {
      title: 'Head to Head',
      href: '/compare',
      icon: <CompareArrowsIcon />
    },
    {
      title: 'Map',
      href: '/map',
      icon: <MapIcon />
    },
    {
      title: 'Account',
      href: '/account',
      icon: <AccountBoxIcon />
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <SettingsIcon />
    },
    {
      title: 'Logout',
      href: '/logout',
      icon: <ExitToAppIcon />

    }
  ]

  return (
    <div>
      <Drawer
        anchor='left'
        classes={{ paper: classes.drawer }}
        onClose={onClose}
        open={open}
        variant={variant}
      >
        <div className={classes.container}>
          <Grid container direction='row' alignItems='center'>
            <Link to='/general' className={classes.routerLink}>
              <Grid item>
                <AccountBalanceIcon className={classes.icon} />
              </Grid>
            </Link>
            <Link to='/general' className={classes.routerLink}>
              <Grid item>
                <Typography variant='h5' color='#00bcd4'>
                  Politisense
                </Typography>
              </Grid>
            </Link>
            <Grid item>
              <Grid item>
                <IconButton onClick={onClose}>
                  {theme.direction === 'ltr' ? <ChevronLeftIcon style={{ color: 'white', marginLeft: 5 }} /> : <ChevronRightIcon />}
                </IconButton>
              </Grid>
              <AppBar
                position='fixed'
                className={clsx(classes.appBar, {
                  [classes.appBarShift]: open
                })}
              />
            </Grid>
          </Grid>
        </div>
        <Divider className={classes.divider1} />
        <div {...rest} className={clsx(classes.root, className)}>
          <ListItemAvatar>
            <RepresentativeImage representativeToLoad={userRepresentative} />
          </ListItemAvatar>
          <MpProfile />
          <Divider className={classes.divider} />
          <SidebarNav className={classes.nav} pages={pages} />
        </div>
      </Drawer>
    </div>
  )
}

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
}

export default Sidebar
