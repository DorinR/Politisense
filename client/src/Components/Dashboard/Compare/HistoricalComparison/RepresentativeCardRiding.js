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
import Box from '@material-ui/core/Box'
import { capitalizedName, getPartyColor, calculateTotalVotesBills, getPartyData } from '../../Utilities/CommonUsedFunctions'
import DividerBlock from '../../Utilities/DividerBlock'
import ColoredText from '../../Utilities/ColoredText'

const useStyles = makeStyles({
  avatar: {
    backgroundColor: '#43D0C4'
  },
  card: {
    width: 420
  }
})

async function fetchPastRepresentativeId(representative, data) {
  const res = await axios.post(`/api/representatives/${representative}/getPastRepresentativeId`, data)
  return res.data.data
}

async function fetchPastRepresentativeVotes(member, data) {
  const res = await axios.get(`/api/votes/${member}/getPastRepresentativeVotes`, data)
  return res.data.data
}

async function fetchPastRepresentativePairedVotes(member, data) {
  const res = await axios.get(`/api/votes/${member}/getPastRepresentativePairedVotes`, data)
  return res.data.data
}

async function fetchPastRepresentativeSpending(member, data) {
  console.log("member ", member)
  console.log("data ", data)
  const res = await axios.post(`/api/budgets/budget/${member}/fetchMemberExpenditures`, data)
  console.log("res data", res.data.data)
  return res.data.data
}

export default function RepresentativeCard() {
  const classes = useStyles()
  const [name, setName] = useState('')
  const [politicalParty, setPoliticalParty] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [start, setStart] = useState('')
  const [nbBills, setNbBills] = useState(0)
  const [nbPairedBills, setNbPairedBills] = useState(0)
  const [partyImageUrl, setPartyImageUrl] = useState('')
  const [totalExpenses, setTotalExpenses] = useState(0)

  const updateNameFromSwitcher = newName => {
    setStart(newName.start)
    setName(newName.name)
    setImageUrl(newName.imageUrl)
    setPoliticalParty(newName.party)
  }

  useEffect(() => {
    async function getData() {
      console.log("TEST")
      const data = { start: start }
      const parliamentData = { parliament: 42 }
      const member = await fetchPastRepresentativeId(name, data)
      const partyData = await getPartyData(politicalParty)
      console.log("party data", partyData)
      const pastRepresentativeVotes = await fetchPastRepresentativeVotes(member, data)
      const pastRepresentativePairedVotes = await fetchPastRepresentativePairedVotes(member, data)
      const totalBills = calculateTotalVotesBills(pastRepresentativeVotes)
      console.log("votes ", totalBills)
      const totalPairedBills = calculateTotalVotesBills(pastRepresentativePairedVotes)
      const expenses = await fetchPastRepresentativeSpending(member, parliamentData)
      console.log("expenses:", expenses)
      setTotalExpenses(expenses)
      setPartyImageUrl(partyData.imageUrl)
      setNbBills(totalBills)
      setNbPairedBills(totalPairedBills)
    }
    if (name) {
      getData()
    }
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
                ><FlagIcon />
                </Avatar>
              </Grid>
              <Grid item xs={9}>
                <Avatar
                  style={{
                    marginLeft: 26,
                    width: 150,
                    height: 150,
                    border: '3px solid #41aaa8'
                  }}
                  alt={name} src={imageUrl} className={classes.bigAvatar}
                />
              </Grid>
            </Grid>
            <List>
              <DividerBlock text='Profile' color={getPartyColor(politicalParty).backgroundColor} />
              <Box m={3} />
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={getPartyColor(politicalParty)}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>{capitalizedName(name)}</ListItemText>
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
              <DividerBlock text='Spending' color={getPartyColor(politicalParty).backgroundColor} />
              <Box m={2} />
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={getPartyColor(politicalParty)}>
                    <DollarIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>Total Spending: {totalExpenses} <ColoredText text={totalExpenses} color={getPartyColor(politicalParty).backgroundColor} /></ListItemText>
              </ListItem>
              <Box m={2} />
              <DividerBlock
                text='Legislative'
                color={getPartyColor(politicalParty).backgroundColor}
                infoBubbleTitle='Number of Bills Sponsored by Members of this Party'
                infoBubbleText={'This is a breakdown of the number of bills that were sponsored by members of the given party. We can see the total number of bills that were sponsored, as well as the portion of those that passed and entered into law, and the portion of those that were not voted into law. To see details about the bills your representative has voted on, go to the "My MP" tab'}
                infoBubbleColor='white'
              />
              <Box m={2} />
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={getPartyColor(politicalParty)}>
                    <FormatListNumberedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText> Total Voted Bills: {nbBills}<ColoredText text={nbBills} color={getPartyColor(politicalParty).backgroundColor} /></ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={getPartyColor(politicalParty)}>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>
                  Total Issued Bills: {nbPairedBills}<ColoredText text={nbPairedBills} color={getPartyColor(politicalParty).backgroundColor} />
                </ListItemText>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
