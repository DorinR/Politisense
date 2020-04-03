import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { Drawer, Typography, ListItem, useMediaQuery, List } from '@material-ui/core'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import SidebarNav from './SidebarNav'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import MpProfile from './MpProfile'
import Divider from '@material-ui/core/Divider'
import MapIcon from '@material-ui/icons/Map'
import CompareArrowsIcon from '@material-ui/icons/CompareArrows'
import { useTheme } from '@material-ui/core/styles'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { fetchUserRiding, fetchRepresentative, fetchRidingCode } from '../Dashboard/Utilities/CommonUsedFunctions'
import AppBar from '@material-ui/core/AppBar'
import Topbar from './Topbar'
import Avatar from '@material-ui/core/Avatar'
import { withRouter } from 'react-router-dom'

const drawerWidth = 220
const drawerWidthXlMode = 250
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#1E2125',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    padding: theme.spacing(2)
  },
  drawer: {
    width: 240,
    backgroundColor: '#1E2125',
    flexGrow: 1

  },
  drawerXl: {
    width: 300,
    backgroundColor: '#1E2125',
    flexGrow: 1
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
  shiftContent: {
    paddingLeft: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  shiftContentXLMode: {
    paddingLeft: drawerWidthXlMode + 10
  },
  contentXlMode: {
    flexGrow: 1,
    height: '100%',
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidthXlMode
  },
  toolbar: {
    paddingTop: theme.spacing(4)
  },
  bigAvatar: {
    marginLeft: theme.spacing(9),
    width: 100,
    height: 100,
    border: '3px solid #00bcd4'
  },
  bigAvatarXL: {
    marginLeft: theme.spacing(12),
    width: 100,
    height: 100,
    border: '3px solid #00bcd4'
  }

}))
const Sidebar = withRouter((props) => {
  const classes = useStyles()
  const theme = useTheme()
  const [riding, setRiding] = useState(null)
  const [user, setUser] = useState(null)

  const isxlScreen = useMediaQuery(theme.breakpoints.up('xl'), {
    defaultMatches: true
  })
  const isDesktop = useMediaQuery(theme.breakpoints.down('lg'), {
    defaultMatches: true
  })
  const mobileVersion = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: true
  })
  const [openSidebar, setOpenSidebar] = useState(true)
  const handleSidebarOpen = () => {
    setOpenSidebar(true)
  }
  const handleSidebarClose = () => {
    setOpenSidebar(false)
  }
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

  const [data, setData] = useState(null)
  useEffect(() => {
    async function getData () {
      if (riding) {
        const promises = await Promise.all([
          fetchRidingCode(riding),
          fetchRepresentative(riding)
        ])
        const ridingCode = promises[0]
        const { name, party, start, end, imageUrl } = promises[1]
        if (name) {
          setData({
            end: end,
            name: name,
            ridingCode: ridingCode,
            riding: riding,
            party: party,
            start: start,
            imageUrl: imageUrl
          })
        }
      }
    }
    getData()
  }, [riding])

  const pages = [
    {
      title: 'General',
      href: '/general',
      icon: <DashboardIcon />
    },
    {
      title: 'My MP',
      href: '/myRepresentative',
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
      title: 'Logout',
      href: '/logout',
      icon: <ExitToAppIcon />

    }
  ]
  const flexContainer = {
    display: 'flex',
    flexDirection: 'row',
    padding: 0
  }
  return (
    <div>
      <Topbar onSidebarOpen={handleSidebarOpen} open={openSidebar} />
      <Drawer
        anchor='left'
        classes={{ paper: isxlScreen ? classes.drawerXl : classes.drawer }}
        onClose={handleSidebarClose}
        open={openSidebar}
        variant={isxlScreen ? 'persistent' : isDesktop && !mobileVersion ? 'persistent' : 'temporary'}
      >
        <List style={flexContainer}>
          <ListItem button onClick={() => { props.history.push({ pathname: '/general' }) }}>
            <AccountBalanceIcon className={classes.icon} />
            <Typography variant='h6' style={{ color: 'white' }}>Politisense</Typography>
          </ListItem>
          <ListItem>
            {theme.direction === 'ltr' ? <ChevronLeftIcon style={!isxlScreen ? { color: 'white', marginLeft: '20%' } : { color: 'white', marginLeft: '40%' }} onClick={handleSidebarClose} /> : <ChevronRightIcon />}
          </ListItem>
        </List>
        <AppBar position='fixed' className={clsx(classes.appBar, { [classes.appBarShift]: openSidebar })} />
        <Divider className={classes.divider1} />
        <div>
          <ListItemAvatar style={{ paddingTop: theme.spacing(1) }}>
            {<Avatar alt={data ? data.name : ''} src={data ? data.imageUrl : ''} className={isxlScreen ? classes.bigAvatarXL : classes.bigAvatar} />}
          </ListItemAvatar>
          <MpProfile data={data} />
          <Divider className={classes.divider} />
          <SidebarNav className={classes.nav} pages={pages} />
        </div>
      </Drawer>
      <div
        className={clsx({
          [classes.toolbar]: true,
          [classes.shiftContent]: isDesktop,
          [classes.shiftContentXLMode]: isxlScreen
        })}
      >
        <main className={clsx(classes.content, {
          [classes.contentShift]: isDesktop && openSidebar,
          [classes.shiftContentXLMode]: isxlScreen && openSidebar
        })}
        >
          <div>
            {props.children}
          </div>
        </main>
      </div>
    </div>
  )
})

export default Sidebar
