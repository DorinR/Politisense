/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import PastMPSwitcher from './PastMPSwitcher'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import axios from 'axios'
import DollarIcon from '@material-ui/icons/Money'
import Grid from '@material-ui/core/Grid'
import FlagIcon from '@material-ui/icons/Flag'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import AssignmentIcon from '@material-ui/icons/Assignment'
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box'

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

function getPartyColor(partyName) {

    switch (partyName) {
        case 'liberal':
            return {
                backgroundColor: '#D71921',
                color: 'white'
            }
        case 'conservative':
            return {
                backgroundColor: '#0C499C',
                color: 'white'
            }
        case 'ndp':
            return {
                backgroundColor: '#EF7E52',
                color: 'white'
            }
        case 'bloc québécois':
            return {
                backgroundColor: '#02819E',
                color: 'white'
            }
        case 'green party':
            return {
                backgroundColor: '#2E8724',
                color: 'white'
            }
        case 'independent':
            return {
                backgroundColor: 'black',
                color: 'white'
            }
        default:
            //backgroundColor = 'white'
            break
    }
}

async function fetchPastRepresentativeId(representative, data) {
    const res = await axios.post(`/api/representatives/${representative}/getPastRepresentativeId`, data)
    return res.data.data
}

async function fetchPastRepresentativeVotes(member) {
    const res = await axios.get(`/api/votes/${member}/getPastRepresentativeVotes`)
    return res.data.data
}

async function fetchPastRepresentativePairedVotes(member) {
    const res = await axios.get(`/api/votes/${member}/getPastRepresentativePairedVotes`)
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
    const [start, setStart] = useState('')
    const [nbBills, setNbBills] = useState(0)
    const [nbPairedBills, setNbPairedBills] = useState(0)

    const updateNameFromSwitcher = newName => {
        setStart(newName.start)
        setName(newName.name)
        setImageUrl(newName.imageUrl)
        setPoliticalParty(newName.party)
        updateHead(newName.name)
    }

    useEffect(() => {
        async function getData() {
            const data = { start: start }
            const member = await fetchPastRepresentativeId(name, data)
            const pastRepresentativeVotes = await fetchPastRepresentativeVotes(member)
            const totalBills = calculateTotalVotesBills(pastRepresentativeVotes)
            setNbBills(totalBills)
            const pastRepresentativePairedVotes = await fetchPastRepresentativePairedVotes(member)
            const totalPairedBills = calculateTotalVotesBills(pastRepresentativePairedVotes)
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
                            <Button variant="contained" fullWidth="true" style={getPartyColor(politicalParty)}>Profile</Button>
                            <Box m={3} />
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar style={getPartyColor(politicalParty)}>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>{capitalize(name)}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar style={getPartyColor(politicalParty)}>
                                        <FlagIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>{capitalize(politicalParty)}</ListItemText>
                            </ListItem>
                            <Box m={2} />
                            <Button variant="contained" fullWidth="true" style={getPartyColor(politicalParty)}>
                                Spending
                            </Button>
                            <Box m={2} />
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar style={getPartyColor(politicalParty)}>
                                        <DollarIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>Total Spending: </ListItemText>
                            </ListItem>
                            <Box m={2} />
                            <Button variant="contained" fullWidth="true" style={getPartyColor(politicalParty)}>
                                Legislative Performance
                            </Button>
                            <Box m={2} />
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar style={getPartyColor(politicalParty)}>
                                        <FormatListNumberedIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText> Total Voted Bills: {nbBills}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar style={getPartyColor(politicalParty)}>
                                        <AssignmentIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>
                                    Total Issued Bills: {nbPairedBills} </ListItemText>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
