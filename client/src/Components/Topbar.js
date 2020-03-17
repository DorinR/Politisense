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

}));

const Topbar = props => {
    const { className, onSidebarOpen, ...rest } = props;

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
               <Link to='/general' className={classes.routerLink}>
                <div>
                    <Grid container direction="row" alignItems="center">
                        <Grid item>
                            <AccountBalanceIcon className={classes.icon}/>
                        </Grid>
                        <Grid item>
                            <Typography variant={"h6"} color={"white"}> Politisense </Typography>
                        </Grid>
                    </Grid>
                </div>
               </Link>
                    {/*<Avatar className={classes.avatar}>*/}
                    {/*    <AccountBalanceIcon className={classes.icon}/>*/}
                    {/*</Avatar>*/}
                    {/*<Typography variant={"h4"} color={"white"}> Politisense </Typography>*/}
                {/*</RouterLink>*/}
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
                                 to={'headTohead'}>Head To Head</Button>
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
                <Hidden lgUp>
                    <IconButton
                        color="inherit"
                        onClick={onSidebarOpen}
                    >
                        <MenuIcon />
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