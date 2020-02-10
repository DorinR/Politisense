import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import HelpIcon from '@material-ui/icons/Help';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import EventSeatIcon from '@material-ui/icons/EventSeat';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import 'typeface-roboto';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  navbarCustomFont: {
    color: '#D71921',
    fontWeight: 'bold',
  },
  current: {
    verticalAlign: 'text-top'
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
        theme.palette.type === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

export default function Pricing() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm" component="main" className={classes.heroContent}>
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Your Government
          </Typography>
        </Container>
        <Container maxWidth="md" component="main">
          <Grid container spacing={5}>
            <Grid item xs={12}>
                <Typography variant="h5" align="center" color="textPrimary" >
                  Current Government <span className={classes.navbarCustomFont}>Liberal Minority </span><HelpIcon color="primary" onClick={handleClickOpen}/>
                </Typography>
              <Container >
                    {Array.apply(null, { length: 31 }).map((e, i) => (
                        <span className="busterCards" key={i}><FiberManualRecordIcon style={{ fontSize: 30, color:'#D71921'}} /></span>))}
                    {Array.apply(null, { length: 24 }).map((e, i) => (
                        <span className="busterCards" key={i}><FiberManualRecordIcon style={{ fontSize: 30, color:'#0C499C'}} /></span>))}
                    {Array.apply(null, { length: 6   }).map((e, i) => (
                        <span className="busterCards" key={i}><FiberManualRecordIcon style={{ fontSize: 30, color:'#EF7E52'}} /></span>))}
                    {Array.apply(null, { length: 5 }).map((e, i) => (
                        <span className="busterCards" key={i}><FiberManualRecordIcon style={{ fontSize: 30, color:'#EF7E52'}} /></span>))}
                    <FiberManualRecordIcon style={{ fontSize: 30, color:'#2E8724'}} />
                    <FiberManualRecordIcon style={{ fontSize: 30, color:'#676767'}} />
              </Container>
            </Grid>
          </Grid>
        </Container>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle >{"What is a minority government?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              In Canada's parliamentary system of responsible government, minority governments occur when no party has a majority of seats in the legislature.
              Typically, but not necessarily, the party with a plurality of seats forms the government.
              In a minority situation, governments must rely on the support of other parties to stay in power, providing less stability than a majority government.
              In Canada, political parties rarely form official coalition governments to form a majority.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </React.Fragment>
  );
}