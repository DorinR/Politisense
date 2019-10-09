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
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import MapIcon from '@material-ui/icons/Map'
import DashboardIcon from '@material-ui/icons/Dashboard'
import Avatar from '@material-ui/core/Avatar'
import trudeau from '../assets/trudeau.jpg'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import PollIcon from '@material-ui/icons/Poll'
import RssFeedIcon from '@material-ui/icons/RssFeed'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { Link } from 'react-router-dom'
import RepresentativeInfo from './Dashboard/Sidebar/RepresentativeInfo'
import RepresentativeImage from './Dashboard/Sidebar/RepresentativeImage'
import Tooltip from '@material-ui/core/Tooltip'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Fab from '@material-ui/core/Fab'
import Box from '@material-ui/core/Box'

const drawerWidth = 240

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
    textDecoration: 'none'
  },
  fab: {
    margin: theme.spacing(2),
    backgroundColor: 'white'
  },
  politisenseIcon: {
    color: '#41aaa8'
  }
}))

export default function MiniDrawer({ children }) {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

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
          <Typography style={{ flex: 1 }}></Typography>
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
        <ListItem button>
          <ListItemIcon>
            <PersonIcon
              className={classes.politisenseIcon}
              onClick={handleDrawerOpen}
            />
          </ListItemIcon>
          {open ? (
            <ListItemAvatar>
              <RepresentativeImage representativeToLoad='Justin Trudeau' />
            </ListItemAvatar>
          ) : null}
        </ListItem>
        {open ? (
          <ListItem>
            <RepresentativeInfo representativeToLoad='Justin Trudeau' />
          </ListItem>
        ) : null}
        <Divider />
        <List>
          <ListItem button onClick={handleDrawerOpen}>
            <ListItemIcon>
              <MapIcon className={classes.politisenseIcon} />
            </ListItemIcon>
            <ListItemText primary='Map' />
          </ListItem>
          <ListItem button onClick={handleDrawerOpen}>
            <ListItemIcon>
              <DashboardIcon className={classes.politisenseIcon} />
            </ListItemIcon>
            <Link to='/dashboard' className={classes.routerLink}>
              Dashboard
            </Link>
          </ListItem>
          <ListItem button onClick={handleDrawerOpen}>
            <ListItemIcon>
              <ExitToAppIcon className={classes.politisenseIcon} />
            </ListItemIcon>
            <Link to='/logout' className={classes.routerLink}>
              Logout
            </Link>
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  )
}
