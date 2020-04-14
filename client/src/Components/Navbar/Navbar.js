import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Drawer, Typography, ListItem, List } from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import SidebarNav from "./SidebarNav";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import MpProfile from "./MpProfile";
import Divider from "@material-ui/core/Divider";
import MapIcon from "@material-ui/icons/Map";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import { useTheme } from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {
  fetchUserRiding,
  fetchRepresentative,
  fetchRidingCode,
} from "../Dashboard/Utilities/CommonUsedFunctions";
import AppBar from "@material-ui/core/AppBar";
import Topbar from "./Topbar";
import Avatar from "@material-ui/core/Avatar";
import { withRouter } from "react-router-dom";

const drawerWidth = 220;
const drawerWidthXlMode = 250;
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#1E2125",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    padding: theme.spacing(2),
  },
  drawer: {
    width: 270,
    backgroundColor: "#1E2125",
    flexGrow: 1,
    [theme.breakpoints.up("xl")]: {
      width: 300,
    },
    display: "flex",
    overflow: "hidden",
    flexDirection: "column",
  },
  chevronLeftIcon: {
    color: "white",
    [theme.breakpoints.up("xl")]: {
      marginLeft: "60%",
    },
    [theme.breakpoints.down("lg")]: {
      marginLeft: "40%",
    },
  },
  drawerXl: {
    width: 350,
    backgroundColor: "#1E2125",
    flexGrow: 1,
  },
  divider: {
    backgroundColor: "grey",
    margin: theme.spacing(2, 0),
  },
  nav: {
    marginBottom: theme.spacing(2),
  },
  avatar: {
    backgroundColor: "white",
    color: "#00bcd4",
    height: 56,
    width: 56,
  },
  icon: {
    height: 45,
    width: 45,
    color: "#00bcd4",
  },
  routerLink: {
    textDecoration: "none",
    color: "WHITE",
    backgroundColor: "#1E2125",
  },
  container: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: "#1E2125",
    textDecoration: "none",
    color: "WHITE",
  },
  divider1: {
    backgroundColor: "grey",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    [theme.breakpoints.up("xl")]: {
      width: `calc(100% - ${drawerWidthXlMode + 20})`,
      marginLeft: drawerWidthXlMode,
    },
    [theme.breakpoints.down("lg")]: {
      width: `calc(100% - ${drawerWidth + 500})`,
      marginLeft: drawerWidth + 30,
    },
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  shiftContent: {
    [theme.breakpoints.up("xl")]: {
      paddingLeft: drawerWidthXlMode + 10,
    },
    [theme.breakpoints.down("lg")]: {
      paddingLeft: drawerWidth + 20,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  shiftContentXLMode: {
    paddingLeft: drawerWidthXlMode + 10,
  },
  contentXlMode: {
    flexGrow: 1,
    height: "100%",
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidthXlMode,
  },
  toolbar: {
    paddingTop: theme.spacing(4),
  },
  bigAvatar: {
    [theme.breakpoints.up("xl")]: {
      marginLeft: theme.spacing(12),
      width: 100,
      height: 100,
      border: "3px solid #00bcd4",
    },
    [theme.breakpoints.down("lg")]: {
      marginLeft: theme.spacing(9),
      width: 100,
      height: 100,
      border: "3px solid #00bcd4",
    },
  },
  bigAvatarXL: {
    marginLeft: theme.spacing(12),
    width: 100,
    height: 100,
    border: "3px solid #00bcd4",
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 0,
    [theme.breakpoints.down("lg")]: {
      paddingTop: theme.spacing(1),
    },
  },
}));
const Sidebar = withRouter((props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(true);
  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };
  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };
  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line no-undef
      const usr = JSON.parse(localStorage.getItem("user"));
      setUser(usr);
    }
  }, [user]);

  const [riding, setRiding] = useState(null);
  useEffect(() => {
    async function getData() {
      if (user) {
        const riding = await fetchUserRiding(user.email);
        setRiding(riding);
      }
    }
    getData();
  }, [user]);

  const [representative, setRepresentative] = useState(null);
  useEffect(() => {
    async function getData() {
      if (riding) {
        const rep = await fetchRepresentative(riding);
        setRepresentative(rep);
      }
    }
    getData();
  }, [riding]);

  const [ridingCode, setRidingCode] = useState(null);
  useEffect(() => {
    async function getData() {
      if (riding) {
        const code = await fetchRidingCode(riding);
        setRidingCode(code);
      }
    }
    getData();
  }, [riding]);

  const pages = [
    {
      title: "General",
      href: "/general",
      icon: <DashboardIcon />,
    },
    {
      title: "My MP",
      href: "/myRepresentative",
      icon: <PeopleIcon />,
    },
    {
      title: "Head to Head",
      href: "/compare",
      icon: <CompareArrowsIcon />,
    },
    {
      title: "Map",
      href: "/map",
      icon: <MapIcon />,
    },
    {
      title: "Logout",
      href: "/logout",
      icon: <ExitToAppIcon />,
    },
  ];

  return (
    <div>
      <Topbar onSidebarOpen={handleSidebarOpen} open={openSidebar} />
      <Drawer
        anchor="left"
        classes={{ paper: classes.drawer }}
        onClose={handleSidebarClose}
        open={openSidebar}
        variant="persistent"
      >
        <div>
          <List className={classes.flexContainer}>
            <ListItem
              button
              onClick={() => {
                props.history.push({ pathname: "/general" });
              }}
            >
              <AccountBalanceIcon className={classes.icon} />
              <Typography variant="h5" style={{ color: "white" }}>
                Politisense
              </Typography>
            </ListItem>
            <ListItem>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon
                  className={classes.chevronLeftIcon}
                  onClick={handleSidebarClose}
                />
              ) : (
                <ChevronRightIcon />
              )}
            </ListItem>
          </List>
        </div>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: openSidebar,
          })}
        />
        <Divider className={classes.divider1} />
        <div>
          {representative && ridingCode && riding ? (
            <div>
              <ListItemAvatar style={{ paddingTop: theme.spacing(1) }}>
                {
                  <Avatar
                    alt={representative ? representative.name : ""}
                    src={representative ? representative.imageUrl : ""}
                    className={classes.bigAvatar}
                  />
                }
              </ListItemAvatar>
              <MpProfile
                representative={representative}
                ridingCode={ridingCode}
                riding={riding}
              />
            </div>
          ) : null}
          <Divider className={classes.divider} />
          <SidebarNav className={classes.nav} pages={pages} />
        </div>
      </Drawer>
      <div
        className={clsx({
          [classes.toolbar]: true,
          [classes.shiftContent]: true,
        })}
      >
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: openSidebar,
          })}
        >
          <div>{props.children}</div>
        </main>
      </div>
    </div>
  );
});

export default Sidebar;
