/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import RepresentativeImage from '../Sidebar/RepresentativeImage'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import DollarIcon from '@material-ui/icons/Money'
import axios from 'axios'
import { getAllBillsByHead } from './CompareRepresentatives'
import Grid from '@material-ui/core/Grid'
import FlagIcon from '@material-ui/icons/Flag'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import AssignmentIcon from '@material-ui/icons/Assignment'

const useStyles = makeStyles({
    card: {
        width: 350
    },
    avatar: {
        backgroundColor: '#43D0C4'
    }
})

function capitalize(str) {
    if (str && isNaN(str)) {
        let res = str
        res = res
            .toLowerCase()
            .split(' ')
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ')
        return res
    }
    return null
}


async function fetchUserRiding(userEmail) {
    return axios
        .get(`/api/users/${userEmail}/getUser`)
        .then(res => {
            if (res.data.success) {
                return res.data.data.riding
            }
        })
        .catch(console.error)
}

async function fetchCurrentRepresentative(riding) {
    let currentRepresentative = {}
    await axios
        .get(`/api/representatives/${riding}/getRepresentative`)
        .then(res => {
            if (res.data.success) {
                currentRepresentative = res.data.data
            }
        })
        .catch(err => console.error(err))
    return currentRepresentative
}

export default function ModernRepresentative(props) {
    const { updateHead, ...other } = props
    const classes = useStyles()
    const [name, setName] = useState('')
    const [totalBills, setTotalBills] = useState(0)
    const [issuedBills, setIssuedBills] = useState(0)
    const [mp, setMp] = React.useState([])
    const [currentRepresentative, setCurrentRepresentative] = React.useState([])
    const [politicalParty, setPoliticalParty] = React.useState([])


    useEffect(() => {
        async function getIssuedBillsByHead(head) {
            const res = await axios.get(
                `http://localhost:5000/api/bills/${head}/getAllBillsBySponsorName`
            )
            return res.data.data
        }

        async function getData(mp) {
            // eslint-disable-next-line
            const user = JSON.parse(localStorage.getItem('user'))
            const riding = await fetchUserRiding(user.email)
            const currentRepresentative = await fetchCurrentRepresentative(riding)
            const bills = await getAllBillsByHead(currentRepresentative.name)
            const total = await calculateTotalVotesBills(bills)
            setTotalBills(total)
            setCurrentRepresentative(currentRepresentative.name)
            setPoliticalParty(currentRepresentative.politicalParty)
            const issuedBillsByHead = await getIssuedBillsByHead(name)
            if (issuedBillsByHead.length != 0) {
                setIssuedBills(issuedBillsByHead.length)
            }
        }
        getData(mp)
        console.log(getData(mp))
    }, [mp])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} align='center'>
            </Grid>
            <Grid item xs={12} align='center'>
                <Card className={classes.card}>
                    <CardContent>
                        <Grid container justify='center'>
                            <Grid item xs={12}>
                                <RepresentativeImage
                                    align='center'
                                    representativeToLoad={name}
                                />
                            </Grid>
                        </Grid>
                        <List>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar className={classes.avatar}>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>{capitalize(currentRepresentative)}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar className={classes.avatar}>
                                        <FlagIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>{capitalize(politicalParty)}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar className={classes.avatar}>
                                        <DollarIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>Total Spending: </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar className={classes.avatar}>
                                        <FormatListNumberedIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText> Total Voted Bills: {totalBills}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar className={classes.avatar}>
                                        <AssignmentIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>
                                    {' '}
                                    Total Issued Bills: {issuedBills}
                                </ListItemText>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
function calculateTotalVotesBills(bills) {
    let totalBills = 0
    if (bills) {
        bills.forEach(bill => totalBills++)
    }
    return totalBills
}
