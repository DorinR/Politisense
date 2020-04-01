import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    votingHistory: {
        backgroundColor: '#FFC300',
        marginTop: 20
    },
    mostPopular: {
        backgroundColor: '#1C53AC',
        color: 'white',
        marginTop: 20
    }
}));

export default function PollsNavbar() {
    const classes = useStyles();

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <TextField id="standard-basic" label="Filter through bills" />
            <Button className={classes.votingHistory}>My Voting History</Button>
            <Button className={classes.mostPopular}>Most Popular Bills</Button>
        </form>
    );
}