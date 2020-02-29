/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Skeleton from '@material-ui/lab/Skeleton'
import CardContent from '@material-ui/core/CardContent'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import RepresentativeImage from '../Sidebar/RepresentativeImage'
import PastMPSwitcher from './PastMPSwitcher'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import { fetchRidingCode } from '../Sidebar/RepresentativeInfo'
import axios from 'axios'
import Box from '@material-ui/core/Box'
import RidingShapeContainer from '../Sidebar/RidingShape/RidingShapeContainer'
import { getAllBillsByHead } from './CompareRepresentatives'
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

async function fetchParliamentData(parlNum) {
    return await axios
        .get(`http://localhost:5000/api/representatives/${parlNum}/getParliamentData`)
        .then(res => {
            if (res.data.success) {
                return res.data.data
            }
        })
        .catch(err => console.error(err))
}

export default function RepresentativeCard(props) {
    const { updateHead, ...other } = props
    const classes = useStyles()
    const [name, setName] = useState('')
    const [politicalParty, setPoliticalParty] = useState('')
    const [riding, setRiding] = useState('')
    const [yearElected, setYearElected] = useState(0)
    const [totalBills, setTotalBills] = useState(0)
    const [ridingCode, setRidingCode] = useState('')
    const [skeleton] = useState([1, 2, 3, 4, 5])
    const [issuedBills, setIssuedBills] = useState(0)
    const [partyRole, setPartyRole] = useState('')
    const [association, setAssociation] = useState('')

    const updateNameFromSwitcher = newName => {
        setName(newName)
        updateHead(newName)
    }

    useEffect(() => {
        setPartyRole('Association on foreign affairs')
        setAssociation('some association')
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
                                <RepresentativeImage
                                    align='center'
                                    representativeToLoad={name}
                                />
                            </Grid>
                        </Grid>
                        {name ? (
                            <List>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar className={classes.avatar}>
                                            <MapIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <Box m={1} />
                                    <div>{partyRole}</div>
                                    <Box m={1} />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar className={classes.avatar}>
                                            <MapIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <Box m={1} />
                                    <div>{association}</div>
                                    <Box m={1} />
                                </ListItem>
                            </List>
                        ) : (
                                <Grid item style={{ paddingTop: '10px' }}>
                                    {skeleton.map(skeleton => {
                                        return <Skeleton animation={false} />
                                    })}
                                </Grid>
                            )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
