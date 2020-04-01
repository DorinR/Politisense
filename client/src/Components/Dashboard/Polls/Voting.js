import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import ImageIcon from '@material-ui/icons/Image';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles({
    card: {
        width: 500
    },
    avatar: {
        backgroundColor: '#43D0C4'
    },
    title: {
        fontSize: 18,
        color: '#000000'
    },
    date: {
        marginBottom: 16,
        fontSize: 10,
    },
    link: {
        fontSize: 14,
        color: '#1e90ff'
    },
    details: {
        fontSize: 14
    },
    description: {
        fontSize: 16
    },
    for: {
        backgroundColor: '#008000',
        color: 'white',
        marginLeft: 10,
        marginTop: 10,
        '&:hover': {
            backgroundColor: "#aee6ae",
            color: 'black'
        }
    },
    against: {
        backgroundColor: '#8b0000',
        color: 'white',
        marginLeft: 20,
        marginTop: 10,
        '&:hover': {
            backgroundColor: "#eba4a4",
            color: 'black'
        }
    },
    alert: {
        fontSize: 14,
        marginTop: 20,
        marginBlock: 10
    }
})

async function fetchRecentBills() {
    return axios
        .get(`http://localhost:5000/api/bills/getUpcomingBills`)
        .then(res => {
            if (res.data.success) {
                return res.data.data
            }
            return null
        })
        .catch(console.error)
}


export default function Voting() {
    const classes = useStyles()
    const [name, setName] = useState('')
    const [recentBills, setRecentBills] = useState([])
    const preventDefault = (event) => event.preventDefault();

    useEffect(() => {
        async function getData() {
            const user = JSON.parse(localStorage.getItem('user'))
            const recentLegislativeActivities = await fetchRecentBills()
            console.log(recentLegislativeActivities[0].data[0])
            setRecentBills(recentLegislativeActivities[0].data[0])
        }
        getData()
    }, [name])

    return (
        <Grid item xs={12} align='center'>
            <List className={classes.root}>
                {recentBills.map(bills => (
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar src='http://www.pngall.com/wp-content/uploads/2016/07/Canada-Leaf-PNG-Clipart.png'>

                            </Avatar>
                        </ListItemAvatar>
                        <Card className={classes.root}>
                            <CardContent>
                                <Typography className={classes.title} color="primary" gutterBottom>
                                    {bills.title}
                                </Typography>
                                <Typography className={classes.date}>
                                    Retrieved on {bills.date}
                                </Typography>
                                <CardActions>
                                    <Typography className={classes.details}>
                                        Get more details
                                    </Typography>
                                    <Typography className={classes.link}>
                                        <Link href="#" onClick={preventDefault} className={classes.link}>
                                            {bills.link}
                                        </Link>
                                    </Typography>
                                </CardActions>
                                <Typography variant="body2" component="p">
                                    {bills.description}
                                </Typography>
                                <Alert className={classes.alert} severity="error">Read the bill properly. Once you cast your vote,
                                it cannot be undone!
                                </Alert>
                                <form noValidate autoComplete="off">
                                    <Button className={classes.for}>For</Button>
                                    <Button className={classes.against}>Against</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </ListItem>
                ))}
            </List>
        </Grid>
    );
}