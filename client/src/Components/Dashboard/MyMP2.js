import React, {useEffect, useState} from 'react'
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
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import BudgetContainer from "./Budget/BudgetContainer";
import BillHistoryTable from "./PastBills/BillHistoryTable";
const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        overflow: 'hidden',
        padding: theme.spacing(0, 3),
        boxShadow: 'none',
        verticalAlign: "middle",
        minWidth: 390,


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
    bigAvatar: {
        width: 130,
        height: 130,
        backgroundColor:'#43D0C4',

        // border: '3px solid #41aaa8'
    }
}));
export default function MyMP2() {
    const classes = useStyles();
    const [hovered,setHovered]= useState(false)


    const toggleOnFontStyle= () =>{
        setHovered(true)
    }
    const toggleOffFontStyle= () =>{
        setHovered(false)
    }
    useEffect(()=>{

    },[])
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
                                    This section shows the current roles and responsibilities by the MP.
                                    The current roles are divided into three categories: Member of Parliament
                                    ,committees, and parliamentary and inter-parliamentary groups and associations.
                                </Typography>
                            </Container>
                        </Grid>

                        <Container maxWidth="lg" component="main">
                            <Grid container spacing={7}>
                                <Grid item xs={12} sm={6} md={4} direction={"row"} alignItems="center"
                                      justify="center">
                                    <Card className={classes.root}>
                                            <Grid item>
                                                <IconButton style={{marginLeft:80}}>
                                                    <Avatar className={classes.bigAvatar}>
                                                        <AccountBalanceIcon style={{ fontSize: 80}}/>
                                                    </Avatar>
                                                </IconButton>
                                            </Grid>
                                            <CardContent>
                                                <Typography>
                                                    <span style={hovered === false ?{fontWeight:'bold',fontSize:20,marginLeft:"15%"} :{fontWeight:'bold',textDecoration: 'underline',fontSize:20,marginLeft:"15%"}}
                                                          onMouseEnter={toggleOnFontStyle}
                                                          onMouseLeave={toggleOffFontStyle}>
                                                        {"Member Of Parliament"}
                                                    </span>
                                                    <IconButton>
                                                        <HelpIcon style={{fontSize:20}}/>
                                                    </IconButton>
                                                </Typography>
                                                <Typography variant="body1"  component="p">
                                                    <ul>
                                                        <li> Charlottetown, Prince Edward Island</li>
                                                    </ul>
                                                </Typography>
                                                <CardActions>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        className={classes.button}
                                                        style={{marginLeft:"20%"}}
                                                    >
                                                        Learn More
                                                    </Button>
                                                </CardActions>
                                            </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4} direction={"row"} alignItems="center"
                                      justify="center">
                                    <Card className={classes.root}>
                                        <Grid item>
                                            <IconButton style={{marginLeft:80}}>
                                                <Avatar className={classes.bigAvatar}>
                                                <BusinessCenterIcon style={{ fontSize: 80 }}/>
                                                </Avatar>
                                            </IconButton>
                                        </Grid>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                <span style={{fontWeight:'bold',fontSize:20,marginLeft:"25%"}}> {"Committees"}</span>
                                                <IconButton>
                                                    <HelpIcon style={{fontSize:20}}/>
                                                </IconButton>
                                            </Typography>
                                            <Typography variant="body1"  component="p">
                                                <ul>
                                                    <li>PCA</li>
                                                    <li>TlCA</li>
                                                </ul>
                                            </Typography>
                                            <CardActions>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.button}
                                                    style={{marginLeft:"20%"}}
                                                >
                                                    Learn More
                                                </Button>
                                            </CardActions>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4} direction={"row"} alignItems="center"
                                      justify="center">
                                    <Card className={classes.root}>
                                        <Grid item>
                                            <IconButton style={{marginLeft:80}}>
                                                <Avatar className={classes.bigAvatar}>
                                                <GroupIcon style={{ fontSize: 80}}/>
                                                </Avatar>
                                            </IconButton>
                                        </Grid>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                <span style={{fontWeight:'bold',fontSize:20}}> {"Inter- and Parliamentary"}</span>
                                                <IconButton>
                                                    <HelpIcon style={{fontSize:20}}/>
                                                </IconButton>
                                            </Typography>
                                            <Typography variant="body1"  component="p">
                                                <ul>
                                                    <li>PCA</li>
                                                    <li>TlCA</li>
                                                </ul>
                                            </Typography>
                                            <CardActions>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.button}
                                                    style={{marginLeft:"20%"}}
                                                >
                                                    Learn More
                                                </Button>
                                            </CardActions>
                                        </CardContent>
                                    </Card>
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
                                Activity Based On Your Interests
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
                                MP's Activity and Bills Proposed
                            </Typography>
                            <Typography variant="h5" align="center" color="textSecondary" component="p">
                                This section shows MP's Voting History & the proposed bills by the MP
                            </Typography>
                        </Container>
                    </Grid>
                    <GeneralDashboard/>
                </Paper>
            </div>
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
                                This section shows MP's Voting History
                            </Typography>
                        </Container>
                    </Grid>
                    <BillHistoryTable/>
                </Paper>

            </div>
            <div>
                <Paper className={classes.paper}>
                    <Grid container
                          direction="row"
                          justify="center">
                        <Container maxWidth="sm" component="main" className={classes.heroContent}>
                            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                Budget
                            </Typography>
                            <Typography variant="h5" align="center" color="textSecondary" component="p">
                                This section shows the budget for the MP and makes a comparison between the
                                current MP and the average mp
                            </Typography>
                        </Container>
                    </Grid>
                    <BudgetContainer/>
                </Paper>
            </div>

        </div>

    )

}