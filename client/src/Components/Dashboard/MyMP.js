import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper';
import Container from "@material-ui/core/Container";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import GroupIcon from '@material-ui/icons/Group';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import { Divider } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import CategoryDashboard from "./CategoryDashboard";
import GeneralDashboard from'./GeneralDashboard'
import Avatar from "@material-ui/core/Avatar";
const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        overflow: 'hidden',
        padding: theme.spacing(0, 3),
        boxShadow: 'none',
        verticalAlign: "middle",

    },
    paper: {
        padding: theme.spacing(2),
        margin: `${theme.spacing(2)}px`,
    },
    h3: {
        fontFamily: 'Martel, serif',
        textTransform: "uppercase",
        letterSpacing: ".075em",
        fontWeight: 200
    },
    table: {
        minWidth: 650,
    },
    containerIconText:{
        display: "inline-flex",
        verticalAlign: "middle",
    },
    typography: {
        fontFamily: [
            'sans-serif',
        ]},
    heroContent: {
        padding: theme.spacing(8, 0, 8),

    },
}));
export default function MyMP() {
    const classes = useStyles();

    return (
        <div>
            <Grid container component="main">
                <Grid item xs={12}>
                        <Paper className={classes.paper}>
                                <Grid container
                                      direction="row"
                                      justify="center">
                                    <Container maxWidth="sm" component="main" className={classes.heroContent}>
                                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                            Current Roles
                                        </Typography>
                                        <Typography variant="h5" align="center" color="textSecondary" component="p">
                                            Quickly build an effective pricing table for your potential customers with this layout.
                                            It&apos;s built with default Material-UI components with little customization.
                                        </Typography>
                                    </Container>
                                </Grid>

                            <Container maxWidth="lg" component="main">
                                <Grid container spacing={6}>
                                        <Grid item xs={12} sm={6} md={4} direction={"row"} alignItems="center"
                                              justify="center">
                                            <Grid item>
                                                <IconButton style={{marginLeft:40}}>
                                                   <AccountBalanceIcon style={{ fontSize: 80,color: '#43D0C4' }}/>
                                                </IconButton>
                                            </Grid>
                                            <Grid item>
                                                <Typography>
                                                    <span style={{fontWeight:'bold',fontSize:20}}> {"Member Of Parliement"}</span>
                                                     <IconButton>
                                                       <HelpIcon style={{fontSize:20}}/>
                                                     </IconButton>
                                                </Typography>
                                            </Grid>
                                                <Typography variant="body1"  component="p">
                                                    <ul>
                                                        <li> Charlottetown, Prince Edward Island</li>
                                                    </ul>
                                                </Typography>
                                        </Grid>

                                    <Grid item xs={12} sm={6} md={4} direction={"row"} alignItems="center"
                                          justify="center">
                                        <Grid item>
                                            <IconButton style={{marginLeft:68}}>
                                                   <BusinessCenterIcon style={{ fontSize: 80, color: '#43D0C4'}}/>
                                            </IconButton>
                                        </Grid>
                                        <Grid item alignItems="center">
                                            <Typography>
                                            <span style={{fontWeight:'bold',fontSize:20, marginLeft:42}}>
                                                    {"Committees"}
                                             <IconButton>
                                                <HelpIcon style={{fontSize:20}}/>
                                             </IconButton>
                                           </span>

                                            </Typography>
                                            <Typography variant="body1"  component="p">
                                                <ul>
                                                    <li> Middle-Eastern Community</li>
                                                    <li>Canadians Group</li>
                                                    <li> German </li>
                                                </ul>
                                            </Typography>
                                         </Grid>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4} direction={"row"} alignItems="center"
                                          justify="center">
                                        <Grid item>
                                            <IconButton style={{marginLeft:50}}>
                                            <GroupIcon style={{ fontSize: 80, color: '#43D0C4'}}/>
                                            </IconButton>
                                        </Grid>
                                        <Grid item alignItems="center">

                                            <Typography>
                                                <span style={{fontWeight:'bold',fontSize:20}}>
                                                    {"Inter- and Parliamentary"}
                                                </span>
                                                <IconButton>
                                                    <HelpIcon style={{fontSize:20}}/>
                                                </IconButton>
                                            </Typography>
                                            <Typography variant="body1" component="p">
                                                <ul>
                                                    <li> PROC</li>
                                                    <li>Canadians Group</li>
                                                    <li> German </li>
                                                </ul>
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Container>
                        </Paper>
                 </Grid>
            </Grid>
            <div>
                <Paper className={classes.paper}>
                    <Grid container
                          direction="row"
                          justify="center">
                        <Container maxWidth="sm" component="main" className={classes.heroContent}>
                            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                Voting History
                            </Typography>
                            <Typography variant="h5" align="center" color="textSecondary" component="p">
                                This section shows the voting history for the current MP based on your current
                                interests and you have the option to update your interests !!
                            </Typography>
                        </Container>
                    </Grid>
                    <CategoryDashboard/>
                </Paper>
            </div>
            <div>
                <Paper className={classes.paper}>
                    <Grid container
                          direction="row"
                          justify="center">
                        <Container maxWidth="sm" component="main" className={classes.heroContent}>
                            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                MP Trends
                            </Typography>
                            <Typography variant="h5" align="center" color="textSecondary" component="p">
                                This section shows MP's Activity and inference based on his issued bills, & votes !
                            </Typography>
                        </Container>
                    </Grid>
                    <GeneralDashboard/>
                </Paper>

            </div>

        </div>

    )

}