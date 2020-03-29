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
import { getAllBillsByHead, capitalizedName, fetchUserRiding, calculateTotalVotesBills, getPartyColor } from '../../Utilities/CommonUsedFunctions'
import Grid from '@material-ui/core/Grid'
import FlagIcon from '@material-ui/icons/Flag'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import AssignmentIcon from '@material-ui/icons/Assignment'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles({
  card: {
    width: 350
  },
  avatar: {
    backgroundColor: '#43D0C4'
  }
})

async function fetchCurrentRepresentative(riding) {
  return axios
    .get(`/api/representatives/${riding}/getRepresentative`)
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
      return null
    })
    .catch(console.error)
}

async function getPartyData(party) {
  return axios
    .get(`/api/parties/${party.toLowerCase()}/getAllPartydata`)
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

export default function ModernRepresentative() {
  const classes = useStyles()
  const [name] = useState('')
  const [totalBills, setTotalBills] = useState(0)
  const [issuedBills, setIssuedBills] = useState(0)
  const [mp] = React.useState([])
  const [currentRepresentative, setCurrentRepresentative] = React.useState([])
  const [politicalParty, setPoliticalParty] = React.useState([])
  const [partyImageUrl, setPartyImageUrl] = useState('')

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
      const partyData = await getPartyData(currentRepresentative.party)
      setPartyImageUrl(partyData.imageUrl)
      const issuedBillsByHead = await getIssuedBillsByHead(name)
      if (issuedBillsByHead.length !== 0) {
        setIssuedBills(issuedBillsByHead.length)
      }
    }
    getData(mp)
  }, [mp])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} align='center'>
        <Card className={classes.card} style={{ marginTop: 65 }}>
          <CardContent>
            <Grid container justify='center'>
              <Grid item xs={3}>
                <Avatar
                  alt='Party Logo'
                  src={partyImageUrl}
                  className={classes.bigAvatar}
                  style={{
                    marginLeft: 12,
                    width: 100,
                    height: 100,
                    border: '3px solid #41aaa8'
                  }}
                />
              </Grid>
              <Grid item xs={9}>
                <RepresentativeImage
                  align='center'
                  representativeToLoad={name}
                />
              </Grid>
            </Grid>
            <List>
              <Button variant='contained' fullWidth='true' style={getPartyColor(politicalParty)}>Profile</Button>
              <Box m={3} />
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={getPartyColor(politicalParty)}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>{capitalizedName(currentRepresentative)}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={getPartyColor(politicalParty)}>
                    <FlagIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>{capitalizedName(politicalParty)}</ListItemText>
              </ListItem>
              <Box m={2} />
              <Button variant='contained' fullWidth='true' style={getPartyColor(politicalParty)}>
                Spending
              </Button>
              <Box m={2} />
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={getPartyColor(politicalParty)}>
                    <DollarIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>Total Spending: N/A</ListItemText>
              </ListItem>
              <Box m={2} />
              <Button variant='contained' fullWidth='true' style={getPartyColor(politicalParty)}>
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
