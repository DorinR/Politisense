import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Alert from '@material-ui/lab/Alert'
import { getIpPostalCode } from './GetIpAddress'

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
        fontSize: 10
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
            backgroundColor: '#aee6ae',
            color: 'black'
        }
    },
    against: {
        backgroundColor: '#8b0000',
        color: 'white',
        marginLeft: 20,
        marginTop: 10,
        '&:hover': {
            backgroundColor: '#eba4a4',
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
        .get('http://localhost:5000/api/bills/getUpcomingBills')
        .then(res => {
            if (res.data.success) {
                return res.data.data
            }
            return null
        })
        .catch(console.error)
}

export async function fetchUserData(userEmail) {
    let result = ''
    await axios
        .get(`http://localhost:5000/api/users/${userEmail}/getUser`,
            { params: { changepassword: userEmail } })
        .then(res => {
            if (res.data.success) {
                const user = res.data.data
                result = user
            }
        })
        .catch(err => console.log(err))
    return result
}

async function retrieveVote(data) {
    const res = await axios.post(`http://localhost:5000/api/voting/vote/`, data)
    console.log(res.data.data)
    return res.data.data
}

// export async function registerVote(userEmail, description, title, vote) {
//     await axios.post(`http://localhost:5000/api/voting/vote`,
//         {
//             body: {
//                 user: { email: userEmail },
//                 activity: { description: description, title: title },
//                 vote: vote
//             }
//         })
//         .then(res => {
//             if (res.data.success) {
//                 const vote = res.data.data
//                 result = vote
//             }
//         })
//         .catch(err => console.log(err))
//     return result
// }

export default function Voting() {
    const classes = useStyles()
    const [name, setName] = useState('')
    const [recentBills, setRecentBills] = useState([])
    const [storagePostalCode, setStoragePostalCode] = useState('')
    const [ipPostalCode, setIpPostalCode] = useState('')
    const preventDefault = (event) => event.preventDefault()
    const [vote, setVote] = useState('')
    const [hasNotClicked, setHasNotClicked] = useState(true)

    useEffect(() => {
        async function getData() {
            const user = JSON.parse(localStorage.getItem('user'))
            const fullUserDetails = await fetchUserData(user.email)
            const postalCode = fullUserDetails.postalCode.substring(0, 3)
            setStoragePostalCode(postalCode)
            const ipAddress = await getIpPostalCode()
            setIpPostalCode(ipAddress)
            const recentLegislativeActivities = await fetchRecentBills()
            const listBills = recentLegislativeActivities[0].data[0]
            setRecentBills(listBills)
        }
        getData()
    }, [name])

    const registerButtonClick = (event, title, description, index) => {
        event.preventDefault()
        console.log("title ", title)
        console.log("description ", description)
        console.log(" vote ", event.currentTarget.value)
        console.log(" index ", index)
        if (event.currentTarget.value === 'yes') {
            console.log("for value ", event.currentTarget.value)
            alert("Yes Clicked!!")
        }
        if (event.currentTarget.value === 'no') {
            console.log("for value ", event.currentTarget.value)
            alert("No Clicked!!")
        }
        setHasNotClicked(false)
    }

    return (
        <Grid item xs={12} align='center'>
            <List className={classes.root}>
                {recentBills.map((bills, index) => (
                    <ListItem key={index} value={bills}>
                        <ListItemAvatar>
                            <Avatar src='http://www.pngall.com/wp-content/uploads/2016/07/Canada-Leaf-PNG-Clipart.png' />
                        </ListItemAvatar>
                        <Card className={classes.root}>
                            <CardContent>
                                <Typography className={classes.title} color='primary' gutterBottom>
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
                                        <Link href='#' onClick={preventDefault} className={classes.link}>
                                            {bills.link}
                                        </Link>
                                    </Typography>
                                </CardActions>
                                <Typography variant='body2' component='p'>
                                    {bills.description}
                                </Typography>
                                {storagePostalCode === ipPostalCode
                                    ? <Alert className={classes.alert} severity='error'>Read the bill properly. Once you cast your vote,
                                    it cannot be undone!
                                 </Alert> : ''}
                                {storagePostalCode === ipPostalCode && hasNotClicked
                                    ? <ButtonGroup>
                                        <Button value='yes' className={classes.for} onClick={(event) => registerButtonClick(event, bills.title, bills.description, index)}>For</Button>
                                        <Button value='no' className={classes.against} onClick={(event) => registerButtonClick(event, bills.title, bills.description, index)}>Against</Button>
                                    </ButtonGroup> : ''}
                            </CardContent>
                        </Card>
                    </ListItem>
                ))}
            </List>
        </Grid>
    )
}
