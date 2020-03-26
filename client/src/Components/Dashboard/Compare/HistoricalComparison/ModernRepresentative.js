/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import RepresentativeImage from '../../Sidebar/RepresentativeImage'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import DollarIcon from '@material-ui/icons/Money'
import axios from 'axios'
import { getAllBillsByHead } from '../CompareRepresentatives'
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
    let currentRepresentative = []
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
            setPoliticalParty(currentRepresentative.party)
            console.log(currentRepresentative.party)
            const issuedBillsByHead = await getIssuedBillsByHead(name)
            if (issuedBillsByHead.length != 0) {
                setIssuedBills(issuedBillsByHead.length)
            }
        }
        getData(mp)
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
                            <Button variant="contained" fullWidth="true" style={getPartyColor(politicalParty)}>Profile</Button>
                            <Box m={3} />
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar style={getPartyColor(politicalParty)}>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>{capitalize(currentRepresentative)}</ListItemText>
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
                                <ListItemText> Total Voted Bills: {totalBills}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar style={getPartyColor(politicalParty)}>
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
