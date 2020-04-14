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
import { capitalizedName, getPartyColor, getPartyData, numericalStyling } from '../../Utilities/CommonUsedFunctions'
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

async function fetchPastRepresentativeId (representative, data) {
  console.log('INSIDE FETCH REP ID')
  const res = await axios.post(`/api/representatives/${representative}/getPastRepresentativeId`, data)
  console.log('res.data.data ', res.data.data)
  return res.data.data
}

async function fetchPastRepresentativeVotes (member, data) {
  const res = await axios.get(`/api/votes/${member}/getPastRepresentativeVotes`, data)
  return res.data.data
}

async function fetchPastRepresentativePairedVotes (member, data) {
  const res = await axios.get(`/api/votes/${member}/getPastRepresentativePairedVotes`, data)
  return res.data.data
}

async function fetchPastRepresentativeSpending (member, data) {
  const res = await axios.post(`/api/budgets/budget/${member}/fetchMemberExpenditures`, data)
  console.log(res.data.data)
  return res.data.data
}

function getStartYear (parlSession) {
  switch (parlSession) {
    case 43:
      return 2019
    case 42:
      return 2015
    case 41:
      return 2011
    case 40:
      return 2008
    default:
      return 'no financial data for this parliament session'
  }
}

export default function RepresentativeCard () {
  const classes = useStyles()
  const [name, setName] = useState('')
  const [politicalParty, setPoliticalParty] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [startDate, setStartDate] = useState('')
  const [nbBills, setNbBills] = useState(0)
  const [nbPairedBills, setNbPairedBills] = useState(0)
  const [partyImageUrl, setPartyImageUrl] = useState('')
  const [totalExpensesYear, setTotalExpensesYear] = useState(0)
  const [parliamentNumber, setParliamentNumber] = useState(0)

  const updateNameFromSwitcher = mpObject => {
    setStartDate(mpObject.start)
    setName(mpObject.name)
    setImageUrl(mpObject.imageUrl)
    setPoliticalParty(mpObject.party)
  }

  useEffect(() => {
    async function getData () {
      const data = { start: startDate }
      const member = await fetchPastRepresentativeId(name, data)
      const partyData = await getPartyData(politicalParty)
      const pastRepresentativeVotes = await fetchPastRepresentativeVotes(member, data)
      const parliamentSession = pastRepresentativeVotes[0].parliament
      const startYear = getStartYear(parliamentSession)
      const parliamentData = { parliament: parliamentSession, year: startYear }
      const pastRepresentativePairedVotes = await fetchPastRepresentativePairedVotes(member, data)
      setParliamentNumber(parliamentData.parliament)
      if (parliamentData.parliament >= 40) {
        const expensesYear = await fetchPastRepresentativeSpending(member, parliamentData)
        setTotalExpensesYear(expensesYear)
      }
      setPartyImageUrl(partyData.imageUrl)
      setNbBills(pastRepresentativeVotes.length)
      setNbPairedBills(pastRepresentativePairedVotes.length)
    }
    if (startDate) {
      getData()
    }
  }, [startDate])

  return (
    <Grid container spacing={2}>
      <Grid
        item xs={12} align='center' style={{
          height: 115
        }}
      >
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
              {parliamentNumber >= 40 ? (
                <DividerBlock
                  text='Spending'
                  color={getPartyColor(politicalParty).backgroundColor}
                  infoBubbleTitle='Cumulative spending'
                  infoBubbleText='Only available data is displayed'
                  infoBubbleColor='white'
                />) : ''}
              <Box m={2} />
              {numericalStyling(totalExpensesYear[0]) !== 'NaN' && parliamentNumber >= 40 ? (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={getPartyColor(politicalParty)}>
                      <DollarIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>{startDate} : <ColoredText text={numericalStyling(totalExpensesYear[0])} color={getPartyColor(politicalParty).backgroundColor} /></ListItemText>
                </ListItem>) : ''}
              {numericalStyling(totalExpensesYear[1]) !== 'NaN' && parliamentNumber >= 40 ? (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={getPartyColor(politicalParty)}>
                      <DollarIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>{startDate + 1} : <ColoredText text={numericalStyling(totalExpensesYear[1])} color={getPartyColor(politicalParty).backgroundColor} /></ListItemText>
                </ListItem>) : ''}
              {numericalStyling(totalExpensesYear[2]) !== 'NaN' && parliamentNumber >= 40 ? (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={getPartyColor(politicalParty)}>
                      <DollarIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>{startDate + 2} : <ColoredText text={numericalStyling(totalExpensesYear[2])} color={getPartyColor(politicalParty).backgroundColor} /></ListItemText>
                </ListItem>) : ''}
              {numericalStyling(totalExpensesYear[3]) !== 'NaN' && parliamentNumber >= 40 ? (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={getPartyColor(politicalParty)}>
                      <DollarIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>{startDate + 3} : <ColoredText text={numericalStyling(totalExpensesYear[3])} color={getPartyColor(politicalParty).backgroundColor} /></ListItemText>
                </ListItem>) : ''}
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
                <ListItemText> Total Voted Bills: <ColoredText text={nbBills} color={getPartyColor(politicalParty).backgroundColor} /></ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={getPartyColor(politicalParty)}>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>
                  Total Issued Bills: <ColoredText text={nbPairedBills} color={getPartyColor(politicalParty).backgroundColor} />
                </ListItemText>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
