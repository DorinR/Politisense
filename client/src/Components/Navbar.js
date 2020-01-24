import React, { useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import PersonIcon from '@material-ui/icons/Person'
import MapIcon from '@material-ui/icons/Map'
import DashboardIcon from '@material-ui/icons/Dashboard'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { Link } from 'react-router-dom'
import RepresentativeInfo from './Dashboard/Sidebar/RepresentativeInfo'
import RepresentativeImage from './Dashboard/Sidebar/RepresentativeImage'
import Tooltip from '@material-ui/core/Tooltip'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Fab from '@material-ui/core/Fab'
import Box from '@material-ui/core/Box'
import axios from 'axios'
import CompareArrowsIcon from '@material-ui/icons/CompareArrows'
const drawerWidth = 330

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1
  },
  bigAvatar: {
    width: 120,
    height: 120,
    border: '2px solid red',
    borderRadius: '50%'
  },
  routerLink: {
    textDecoration: 'none',
    color: 'inherit'
  },
  fab: {
    margin: theme.spacing(2),
    backgroundColor: 'white'
  },
  politisenseIcon: {
    color: '#41aaa8'
  }
}))

export async function fetchUserRiding (userEmail) {
  let result = ''
  await axios
    .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
    .then(res => {
      if (res.data.success) {
        const riding = res.data.data.riding
        result = riding
      }
    })
    .catch(err => console.error(err))
  return result
}

export async function fetchRepresentative (riding) {
  let result = ''
  await axios
    .get(
          `http://localhost:5000/api/representatives/${riding}/getRepresentative`
    )
    .then(res => {
      if (res.data.success) {
        const representative = res.data.data.name
        result = representative
      }
    })
    .catch(err => console.error(err))
  return result
}

export default function MiniDrawer ({ children }) {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [userRepresentative, setUserRepresentative] = React.useState('')

  useEffect(() => {
    handleDrawerOpen()
    async function getData () {
      /* eslint-disable */
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        const { email } = user
        const riding = await fetchUserRiding(email)
        const representative = await fetchRepresentative(riding)
        setUserRepresentative(representative)
      }
    }
    getData()
  }, [])

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
            position='fixed'
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open
            })}
        >
          <Toolbar>
            <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={handleDrawerOpen}
                edge='start'
                className={clsx(classes.menuButton, {
                  [classes.hide]: open
                })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' noWrap>
              Politisense
            </Typography>
            <Typography style={{ flex: 1 }} />
            <Link to='/account'>
              <Tooltip title='My Account' aria-label='add'>
                <Fab size='small' className={classes.fab}>
                  <AccountCircleIcon
                      fontSize='large'
                      className={classes.politisenseIcon}
                  />
                </Fab>
              </Tooltip>
            </Link>
          </Toolbar>
        </AppBar>
        <Drawer
            variant='permanent'
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open
              })
            }}
            open={open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? (
                  <ChevronRightIcon />
              ) : (
                  <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <Box p={1} />
          <ListItem button onClick={handleDrawerOpen}>
            <ListItemIcon>
              <PersonIcon className={classes.politisenseIcon} />
            </ListItemIcon>
            {open ? (
                <ListItemAvatar>
                  <RepresentativeImage representativeToLoad={userRepresentative} />
                </ListItemAvatar>
            ) : null}
          </ListItem>
          {open ? (
              <ListItem>
                <RepresentativeInfo representativeToLoad={userRepresentative} />
              </ListItem>
          ) : null}
          <Divider />
          <List>
            <Link to='/map' className={classes.routerLink}>
              <ListItem button>
                <ListItemIcon>
                  <MapIcon className={classes.politisenseIcon} />
                </ListItemIcon>
                Map
              </ListItem>
            </Link>
            <Link to='/dashboard' className={classes.routerLink}>
              <ListItem button>
                <ListItemIcon>
                  <DashboardIcon className={classes.politisenseIcon} />
                </ListItemIcon>
                Dashboard
              </ListItem>
            </Link>
            <Link to='/headToHeadComparison' className={classes.routerLink}>
              <ListItem button>
                <ListItemIcon>
                  <CompareArrowsIcon className={classes.politisenseIcon} />
                </ListItemIcon>
                Head VS Head
              </ListItem>
            </Link>
            <Link to='/logout' className={classes.routerLink}>
              <ListItem button>
                <ListItemIcon>
                  <ExitToAppIcon className={classes.politisenseIcon} />
                </ListItemIcon>
                Logout
              </ListItem>
            </Link>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {children}
        </main>
      </div>
  )
}