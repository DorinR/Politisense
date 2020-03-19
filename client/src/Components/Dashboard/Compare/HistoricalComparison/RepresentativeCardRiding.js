/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Skeleton from '@material-ui/lab/Skeleton'
import CardContent from '@material-ui/core/CardContent'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import RepresentativeImage from '../../Sidebar/RepresentativeImage'
import PastMPSwitcher from './PastMPSwitcher'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import { fetchRidingCode } from '../../Sidebar/RepresentativeInfo'
import axios from 'axios'
import DollarIcon from '@material-ui/icons/Money'
import Box from '@material-ui/core/Box'
import RidingShapeContainer from '../../Sidebar/RidingShape/RidingShapeContainer'
import { getAllBillsByHead } from '../CompareRepresentatives'
import Grid from '@material-ui/core/Grid'
import FlagIcon from '@material-ui/icons/Flag'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import MapIcon from '@material-ui/icons/Map'
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

// async function fetchPastRepresentativesVotes(memberId) {
//     let pastRepresentativesVotes = []
//     await axios
//         .get(`/api/votes/${memberId}/getPastRepresentativesVotes`)
//         .then(res => {
//             if (res.data.success) {
//                 pastRepresentativesVotes = res.data.data
//             }
//         })
//         .catch(err => console.error(err))
//     console.log(pastRepresentativesVotes)
//     return pastRepresentativesVotes
// }

async function fetchPastRepresentativesVotes(memberId) {
    const res = await axios.get(`/api/votes/${memberId}/getPastRepresentativesVotes`)
    return res.data.data
}

async function fetchPastRepresentativesPairedVotes(memberId) {
    const res = await axios.get(`/api/votes/${memberId}/getPastRepresentativesPairedVotes`)
    return res.data.data
}

function calculateTotalVotesBills(bills) {
    let totalBills = 0
    if (bills) {
        bills.forEach(bill => totalBills++)
    }
    return totalBills
}

export default function RepresentativeCard(props) {
    const { updateHead, ...other } = props
    const classes = useStyles()
    const [name, setName] = useState('')
    const [politicalParty, setPoliticalParty] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [nbBills, setNbBills] = useState(0)
    const [nbPairedBills, setNbPairedBills] = useState(0)
    //const [issuedBills, setIssuedBills] = useState(0)
    //const [pastRepresentativesVotes, setPastRepresentativesVotes] = React.useState([])

    const updateNameFromSwitcher = newName => {
        setName(newName.name)
        setImageUrl(newName.imageUrl)
        setPoliticalParty(newName.party)
        updateHead(newName.name)
    }

    useEffect(() => {
        async function getData() {
            const memberId = 'cP0FiFwOuobtHAMx5wUE'
            const pastRepresentativesVotes = await fetchPastRepresentativesVotes(memberId)
            const totalBills = calculateTotalVotesBills(pastRepresentativesVotes)
            setNbBills(totalBills)
            const pastRepresentativesPairedVotes = await fetchPastRepresentativesPairedVotes(memberId)
            const totalPairedBills = calculateTotalVotesBills(pastRepresentativesPairedVotes)
            setNbPairedBills(totalPairedBills)
        }
        getData()
    }, [name])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} align='center'>
                <PastMPSwitcher functionUpdate={updateNameFromSwitcher} />
            </Grid>
            <Grid item xs={12} align='center'>
                <Card className={classes.card}>
                    <CardContent>
                        <Grid container justify='center'>
                            <Grid item xs={12}>
                                <Avatar style={{
                                    marginLeft: 26,
                                    width: 150,
                                    height: 150,
                                    border: '3px solid #41aaa8'
                                }}
                                    alt={name} src={imageUrl} className={classes.bigAvatar} />
                            </Grid>
                        </Grid>
                        <List>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar className={classes.avatar}>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>{capitalize(name)}</ListItemText>
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
                                <ListItemText> Total Voted Bills: {nbBills}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar className={classes.avatar}>
                                        <AssignmentIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>
                                    Total Issued Bills:
                                </ListItemText>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
