import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles({
    card: {
        width: 350
    },
    avatar: {
        backgroundColor: '#43D0C4'
    },
    card: {
        width: 420
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
    // const [nbPairedBills, setNbPairedBills] = useState(0)
    // const [partyImageUrl, setPartyImageUrl] = useState('')

    useEffect(() => {
        async function getData() {
            const user = JSON.parse(localStorage.getItem('user'))
            console.log(user.email)
            const recentLegislativeActivities = await fetchRecentBills()
            setRecentBills(recentLegislativeActivities)
            console.log(recentLegislativeActivities)
            //console.log(recentLegislativeActivities.bills[0])
        }
        getData()
    }, [name])

    return (
        <Grid item xs={6} align='center'>
            <List className={classes.root}>
                {recentBills.map(bills => (
                    <ListItem>
                        {/* <ListItemAvatar>
                            <Avatar>
                                <ImageIcon />
                            </Avatar>
                        </ListItemAvatar> */}
                        <ListItemText primary={bills.title} secondary={bills.date} />
                    </ListItem>
                ))}
            </List>
        </Grid>
    );
}