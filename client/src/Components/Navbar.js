// import React, { useEffect, useState } from 'react'
// import clsx from 'clsx'
// import { makeStyles, useTheme } from '@material-ui/core/styles'
// import Drawer from '@material-ui/core/Drawer'
// import AppBar from '@material-ui/core/AppBar'
// import Toolbar from '@material-ui/core/Toolbar'
// import List from '@material-ui/core/List'
// import CssBaseline from '@material-ui/core/CssBaseline'
// import Typography from '@material-ui/core/Typography'
// import Divider from '@material-ui/core/Divider'
// import IconButton from '@material-ui/core/IconButton'
// import MenuIcon from '@material-ui/icons/Menu'
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
// import ChevronRightIcon from '@material-ui/icons/ChevronRight'
// import ListItem from '@material-ui/core/ListItem'
// import ListItemIcon from '@material-ui/core/ListItemIcon'
// import PersonIcon from '@material-ui/icons/Person'
// import ExitToAppIcon from '@material-ui/icons/ExitToApp'
// import { Link } from 'react-router-dom'
// import ListItemAvatar from '@material-ui/core/ListItemAvatar'
// import RepresentativeInfo from './Dashboard/Sidebar/RepresentativeInfo'
// import RepresentativeImage from './Dashboard/Sidebar/RepresentativeImage'
// import Tooltip from '@material-ui/core/Tooltip'
// import AccountCircleIcon from '@material-ui/icons/AccountCircle'
// import Fab from '@material-ui/core/Fab'
// import Box from '@material-ui/core/Box'
// import politisenseLogo from '../politisenseLogo.png'
// import Button from '@material-ui/core/Button'
//
// const drawerWidth = 240
//
// // const useStyles = makeStyles(theme => ({
// //   root: {
// //     display: 'flex'
// //   },
// //   appBar: {
// //     zIndex: theme.zIndex.drawer + 1,
// //     transition: theme.transitions.create(['width', 'margin'], {
// //       easing: theme.transitions.easing.sharp,
// //       duration: theme.transitions.duration.leavingScreen
// //     })
// //   },
// //   appBarShift: {
// //     marginLeft: drawerWidth,
// //     width: `calc(100% - ${drawerWidth}px)`,
// //     transition: theme.transitions.create(['width', 'margin'], {
// //       easing: theme.transitions.easing.sharp,
// //       duration: theme.transitions.duration.enteringScreen
// //     })
// //   },
// //   menuButton: {
// //     marginRight: 36
// //   },
// //   hide: {
// //     display: 'none'
// //   },
// //   drawer: {
// //     width: drawerWidth,
// //     flexShrink: 0,
// //     whiteSpace: 'nowrap'
// //   },
// //   drawerOpen: {
// //     width: drawerWidth,
// //     transition: theme.transitions.create('width', {
// //       easing: theme.transitions.easing.sharp,
// //       duration: theme.transitions.duration.enteringScreen
// //     })
// //   },
// //   drawerClose: {
// //     transition: theme.transitions.create('width', {
// //       easing: theme.transitions.easing.sharp,
// //       duration: theme.transitions.duration.leavingScreen
// //     }),
// //     overflowX: 'hidden',
// //     width: theme.spacing(7) + 1,
// //     [theme.breakpoints.up('sm')]: {
// //       width: theme.spacing(9) + 1
// //     }
// //   },
// //   toolbar: {
// //     display: 'flex',
// //     alignItems: 'center',
// //     justifyContent: 'flex-end',
// //     padding: theme.spacing(0, 1),
// //     ...theme.mixins.toolbar
// //   },
// //   content: {
// //     flexGrow: 1
// //   },
// //   bigAvatar: {
// //     width: 120,
// //     height: 120,
// //     border: '2px solid red',
// //     borderRadius: '50%'
// //   },
// //   routerLink: {
// //     textDecoration: 'none',
// //     color: 'inherit'
// //   },
// //   fab: {
// //     margin: theme.spacing(2),
// //     backgroundColor: 'white'
// //   },
// //   politisenseIcon: {
// //     color: '#41aaa8'
// //   },
// //   navbarCustomFont: {
// //     textDecoration: 'none',
// //     marginRight: '10px',
// //     '&:hover': {
// //       color: '#d4d7dd'
// //     }
// //   },
// //   navbarCustomButton: {
// //     color: '#42AAA8',
// //     backgroundColor: '#F7F7F7',
// //     fontWeight: 'bold',
// //     fontStyle: 'italic',
// //     fontSize: '1.2em',
// //     '&:hover': {
// //       backgroundColor: '#d4d7dd'
// //     }
// //   },
// //   logoStyling: {
// //     width: '90%',
// //     height: 'auto',
// //     padding: '10px 0px',
// //     marginTop: '8px',
// //     marginLeft: '20px'
// //   }
// // }))
// const useStyles = makeStyles(theme => ({
//   drawer: {
//     width: 240,
//     [theme.breakpoints.up('lg')]: {
//       marginTop: 64,
//       height: 'calc(100% - 64px)'
//     }
//   },
//   root: {
//     backgroundColor: theme.palette.white,
//     display: 'flex',
//     flexDirection: 'column',
//     height: '100%',
//     padding: theme.spacing(2)
//   },
//   divider: {
//     margin: theme.spacing(2, 0)
//   },
//   nav: {
//     marginBottom: theme.spacing(2)
//   }
// }));
//
// export async function fetchUserRiding (userEmail) {
//   return axios
//     .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
//     .then(res => {
//       if (res.data.success) {
//         return res.data.data.riding
//       }
//     })
//     .catch(console.error)
// }
//
// export async function fetchRepresentative (riding) {
//   return axios.get(
//           `http://localhost:5000/api/representatives/${riding}/getRepresentative`
//   )
//     .then(res => {
//       if (res.data.success) {
//         return res.data.data.name
//       }
//     })
//     .catch(console.error)
// }
//
// export default function MiniDrawer ({ children }) {
//   const classes = useStyles()
//   const theme = useTheme()
//   const [open, setOpen] = React.useState(false)
//   const [userRepresentative, setUserRepresentative] = React.useState(null)
//   const [riding, setRiding] = useState(null)
//   const [user, setUser] = useState(null)
//
//   useEffect(() => {
//     // eslint-disable-next-line no-undef
//     const user = JSON.parse(localStorage.getItem('user'))
//     setUser(user)
//   }, [])
//
//   useEffect(() => {
//     async function getData () {
//       if (user) {
//         const riding = await fetchUserRiding(user.email)
//         setRiding(riding)
//       }
//     }
//     getData()
//   }, [user])
//
//   useEffect(() => {
//     async function getData () {
//       if (riding) {
//         const representative = await fetchRepresentative(riding)
//         setUserRepresentative(representative)
//       }
//     }
//     getData()
//   }, [riding])
//
//   useEffect(() => {
//     handleDrawerOpen()
//   }, [userRepresentative])
//
//   const handleDrawerOpen = () => {
//     setOpen(true)
//   }
//
//   const handleDrawerClose = () => {
//     setOpen(false)
//   }
//   return (
//     <div className={classes.root}>
//       <CssBaseline />
//       <AppBar
//         position='fixed'
//         className={clsx(classes.appBar, {
//           [classes.appBarShift]: open
//         })}
//       >
//         <Toolbar>
//           <IconButton
//             color='inherit'
//             aria-label='open drawer'
//             onClick={handleDrawerOpen}
//             edge='start'
//             className={clsx(classes.menuButton, {
//               [classes.hide]: open
//             })}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Link to='/general' className={classes.navbarCustomFont}>
//             <Button
//               variant='contained'
//               color='primary'
//               className={classes.navbarCustomButton}
//             >
//               General
//             </Button>
//           </Link>
//           <Link to='/categories' className={classes.navbarCustomFont}>
//             <Button variant='contained' className={classes.navbarCustomButton}>
//               Categories
//             </Button>
//           </Link>
//           <Link to='/votingHistory' className={classes.navbarCustomFont}>
//             <Button
//               variant='contained'
//               color='primary'
//               className={classes.navbarCustomButton}
//             >
//               Voting History
//             </Button>
//           </Link>
//           <Link to='/budget' className={classes.navbarCustomFont}>
//             <Button
//               variant='contained'
//               color='primary'
//               className={classes.navbarCustomButton}
//             >
//               Budget
//             </Button>
//           </Link>
//           <Link to='/map' className={classes.navbarCustomFont}>
//             <Button
//               variant='contained'
//               color='primary'
//               className={classes.navbarCustomButton}
//             >
//               Map
//             </Button>
//           </Link>
//           <Typography style={{ flex: 1 }} />
//           <Link to='/account'>
//             <Tooltip title='My Account' aria-label='add'>
//               <Fab size='small' className={classes.fab}>
//                 <AccountCircleIcon
//                   fontSize='large'
//                   className={classes.politisenseIcon}
//                 />
//               </Fab>
//             </Tooltip>
//           </Link>
//         </Toolbar>
//       </AppBar>
//       <Drawer
//           anchor="left"
//           classes={{ paper: classes.drawer }}
//           onClose={onClose}
//           open={open}
//           variant={variant}
//       >
//         <div className={classes.toolbar}>
//           {open ? (
//             <Typography variant='h6' noWrap>
//               <Link to='/general' className={classes.routerLink}>
//                 <img
//                   src={politisenseLogo}
//                   alt='politisense logo'
//                   className={classes.logoStyling}
//                 />
//               </Link>
//             </Typography>
//           ) : null}
//           <Box p={1} />
//           <IconButton onClick={handleDrawerClose}>
//             {theme.direction === 'rtl' ? (
//               <ChevronRightIcon />
//             ) : (
//               <ChevronLeftIcon />
//             )}
//           </IconButton>
//         </div>
//         <Divider />
//         <ListItem button onClick={handleDrawerOpen}>
//           <ListItemIcon>
//             <PersonIcon className={classes.politisenseIcon} />
//           </ListItemIcon>
//           {open ? (
//             <ListItemAvatar>
//               <RepresentativeImage representativeToLoad={userRepresentative} />
//             </ListItemAvatar>
//           ) : null}
//         </ListItem>
//         {open ? (
//           <ListItem>
//             <RepresentativeInfo representativeToLoad={userRepresentative} />
//           </ListItem>
//         ) : null}
//         <Divider />
//         <List>
//           <Link to='/logout' className={classes.routerLink}>
//             <ListItem button>
//               <ListItemIcon>
//                 <ExitToAppIcon className={classes.politisenseIcon} />
//               </ListItemIcon>
//               Logout
//             </ListItem>
//           </Link>
//         </List>
//       </Drawer>
//       <main className={classes.content}>
//         <div className={classes.toolbar} />
//         {children}
//       </main>
//     </div>
//   )
// }
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Drawer, Grid, Toolbar, Typography } from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import ImageIcon from "@material-ui/icons/Image";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import SettingsIcon from "@material-ui/icons/Settings";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import RepresentativeImage from "./Dashboard/Sidebar/RepresentativeImage";
import SidebarNav from "./SidebarNav";
import axios from "axios";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import RepresentativeInfo from "./Dashboard/Sidebar/RepresentativeInfo";
import AppBar from "@material-ui/core/AppBar";
import { Link } from "react-router-dom";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import MpProfile from "./Dashboard/MpProfile";
import Divider from "@material-ui/core/Divider";
import MapIcon from "@material-ui/icons/Map";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";

export async function fetchUserRiding(userEmail) {
  return axios
    .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
    .then(res => {
      if (res.data.success) {
        return res.data.data.riding;
      }
    })
    .catch(console.error);
}

export async function fetchRepresentative(riding) {
  return axios
    .get(
      `http://localhost:5000/api/representatives/${riding}/getRepresentative`
    )
    .then(res => {
      if (res.data.success) {
        return res.data.data.name;
      }
    })
    .catch(console.error);
}
const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240
  },
  root: {
    backgroundColor: "#1E2125",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(2)
  },
  divider: {
    backgroundColor: "grey",
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  },
  avatar: {
    backgroundColor: "white",
    color: "#00bcd4",
    height: 56,
    width: 56
  },
  icon: {
    height: 40,
    width: 40,
    color: "#00bcd4"
  },
  routerLink: {
    textDecoration: "none",
    color: "WHITE",
    backgroundColor: "#1E2125"
  },
  container: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  divider1: {
    // margin: theme.spacing(2, 0),
    backgroundColor: "grey"
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;
  const [userRepresentative, setUserRepresentative] = React.useState(null);
  const [riding, setRiding] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

  useEffect(() => {
    async function getData() {
      if (user) {
        const riding = await fetchUserRiding(user.email);
        setRiding(riding);
      }
    }
    getData();
  }, [user]);

  useEffect(() => {
    async function getData() {
      if (riding) {
        const representative = await fetchRepresentative(riding);
        setUserRepresentative(representative);
      }
    }
    getData();
  }, [riding]);
  const classes = useStyles();

  const pages = [
    {
      title: "General",
      href: "/general",
      icon: <DashboardIcon />
    },
    {
      title: "My MP",
      href: "/myMp",
      icon: <PeopleIcon />
    },
    {
      title: "Head to Head",
      href: "/products",
      icon: <CompareArrowsIcon />
    },
    {
      title: "Map",
      href: "/map",
      icon: <MapIcon />
    },
    {
      title: "Account",
      href: "/account",
      icon: <AccountBoxIcon />
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <SettingsIcon />
    }
  ];

  return (
    <div>
      <Drawer
        anchor="left"
        classes={{ paper: classes.drawer }}
        onClose={onClose}
        open={open}
        variant={variant}
      >
        <Link to="/general" className={classes.routerLink}>
          <div className={classes.container}>
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <AccountBalanceIcon className={classes.icon} />
              </Grid>
              <Grid item>
                <Typography variant={"h5"} color={"#00bcd4"}>
                  {" "}
                  Politisense{" "}
                </Typography>
              </Grid>
              <Grid item>
                <AppBar />
              </Grid>
            </Grid>
          </div>
        </Link>
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
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
