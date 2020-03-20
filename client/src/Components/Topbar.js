import React, {forwardRef, useState} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {AppBar, Toolbar, Badge, Hidden, IconButton, Avatar} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import {
    Typography
} from '@material-ui/core';


const CustomRouterLinkTopBar = forwardRef((props, ref) => (
    <div
        ref={ref}
    >
        <RouterLink {...props} />
    </div>
));
const useStyles = makeStyles(theme => ({
    root: {
        boxShadow: 'none',
        backgroundColor: "#00bcd4",
//43D0C4
    },
    flexGrow: {
        flexGrow: 2
    },
    signOutButton: {
        marginLeft: theme.spacing(1)
    },
    avatar: {
        backgroundColor: "white",
        color: "white",
        height: 56,
        width: 56
    },
    icon: {
        height: 32,
        width: 32,
        color: "white",

    },
    routerLink: {
    textDecoration: 'none',
    color: 'white'
  },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },

}));

const Topbar = props => {
    const { className,open, onSidebarOpen, ...rest } = props;

    const classes = useStyles();

    const [notifications] = useState([]);

   const routeChange=(path)=> {
       this.props.history.push(path);
    }
    return (
        <AppBar
            {...rest}
            className={clsx(classes.root, className)}
        >
            <Toolbar>
                <div>
                    <Grid container direction="row" alignItems="center">
                        <Grid item className={classes.flexGrow}>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={onSidebarOpen}
                                edge="start"
                                // className={clsx(classes.menuButton, open && classes.hide)}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Grid>
                        <Link to='/general' className={classes.routerLink}>
                        <Grid item>
                            <AccountBalanceIcon className={classes.icon}/>
                        </Grid>
                        </Link>
                        <Link to='/general' className={classes.routerLink}>
                        <Grid item>
                            <Typography variant={"h6"} color={"white"}> Politisense </Typography>
                        </Grid>
                        </Link>
                    </Grid>
                </div>

                <div className={classes.flexGrow} />
                <Hidden mdDown>
                        <Button style={{ color:'white', textTransform:'none'}} variant={"text"}
                                component={CustomRouterLinkTopBar}
                                to={'/general'}>General</Button>
                        <Button style={{ color:'white',textTransform:'none' }} variant={"text"}
                                component={CustomRouterLinkTopBar}
                                to={'/myMp'}>My MP</Button>
                        <Button  style={{ color:'white',textTransform:'none' }} variant={"text"}
                                 component={CustomRouterLinkTopBar}
                                 to={'/compare'}>Head To Head</Button>
                        <Button style={{ color:'white',textTransform:'none' }} variant={"text"}
                                component={CustomRouterLinkTopBar}
                                to={'/map'}>Map</Button>
                    <IconButton
                        // color="inherit"
                    >
                        <Badge
                            badgeContent={notifications.length}
                            // color="primary"
                            variant="dot"
                        >
                            <NotificationsIcon style={{ color:"white"}}/>
                        </Badge>
                    </IconButton>
                    <IconButton
                        className={classes.signOutButton}
                        // color="inherit"
                        >
                        <Link to='/logout' className={classes.routerLink}>
                        <InputIcon style={{ color:"white"}}/>
                        </Link>
                    </IconButton>
                </Hidden>

            </Toolbar>
        </AppBar>
    );
};

Topbar.propTypes = {
    className: PropTypes.string,
    onSidebarOpen: PropTypes.func
};

export default Topbar;