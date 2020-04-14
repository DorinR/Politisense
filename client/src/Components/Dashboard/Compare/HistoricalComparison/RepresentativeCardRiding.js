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
  const res = await axios.post(`/api/representatives/${representative}/getPastRepresentativeId`, data)
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
  return res.data.data
}

export default function RepresentativeCard () {
  const classes = useStyles()
  const [nbBills, setNbBills] = useState(0)
  const [nbPairedBills, setNbPairedBills] = useState(0)
  const [partyImageUrl, setPartyImageUrl] = useState('')
  const [totalExpensesYear, setTotalExpensesYear] = useState(0)
  const [parliamentNumber, setParliamentNumber] = useState(0)
  const [member, setMember] = useState(null)
  const [mpDropdown, setMpDropdown] = useState(null)
  const [dataObject, setDataObject] = useState(null)

  const updateNameFromSwitcher = mpObject => {
    setMpDropdown(mpObject)
  }

  useEffect(() => {
    async function getData () {
      // eslint-disable-next-line no-undef
      const data = { start: mpDropdown.start }
      setDataObject(data)
      const member = await fetchPastRepresentativeId(mpDropdown.name, data)
      setMember(member)
      const partyData = await getPartyData(mpDropdown.party)
      setPartyImageUrl(partyData.imageUrl)
    }
    if (mpDropdown) {
      getData()
    }
  }, [mpDropdown])

  useEffect(() => {
    async function getData () {
      // eslint-disable-next-line no-undef
      const pastRepresentativeVotes = await fetchPastRepresentativeVotes(member, dataObject)
      const parliamentSession = pastRepresentativeVotes[0].parliament
      const parliamentData = { parliament: parliamentSession, year: dataObject.start }
      const pastRepresentativePairedVotes = await fetchPastRepresentativePairedVotes(member, dataObject)
      setParliamentNumber(parliamentData.parliament)
      if (parliamentData.parliament >= 40) {
        const expensesYear = await fetchPastRepresentativeSpending(member, parliamentData)
        setTotalExpensesYear(expensesYear)
      }
      setNbBills(pastRepresentativeVotes.length)
      setNbPairedBills(pastRepresentativePairedVotes.length)
    }
    if (member && dataObject) {
      getData()
    }
  }, [member, dataObject])

  return (
    <Grid container spacing={2}>
      <Grid
        item xs={12} align='center' style={{
          height: 115
        }}
      >
        <PastMPSwitcher changeRepresentative={updateNameFromSwitcher} />
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
              {mpDropdown ? (
                <Grid item xs={9}>
                  <Avatar
                    style={{
                      marginLeft: 26,
                      width: 150,
                      height: 150,
                      border: '3px solid #41aaa8'
                    }}
                    alt={mpDropdown.name} src={mpDropdown.imageUrl} className={classes.bigAvatar}
                  />
                </Grid>) : ''}
            </Grid>
            {parliamentNumber ? (
              <List>
                <DividerBlock text='Profile' color={getPartyColor(mpDropdown.party).backgroundColor} />
                <Box m={3} />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={getPartyColor(mpDropdown.party)}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>{capitalizedName(mpDropdown.name)}</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={getPartyColor(mpDropdown.party)}>
                      <FlagIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>{capitalizedName(mpDropdown.party)}</ListItemText>
                </ListItem>
                <Box m={2} />
                {parliamentNumber >= 40 ? (
                  <DividerBlock
                    text='Spending'
                    color={getPartyColor(mpDropdown.party).backgroundColor}
                    infoBubbleTitle='Cumulative spending'
                    infoBubbleText='Only available data is displayed'
                    infoBubbleColor='white'
                  />) : ''}
                <Box m={2} />
                {numericalStyling(totalExpensesYear[0]) !== 'NaN' && parliamentNumber >= 40 ? (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={getPartyColor(mpDropdown.party)}>
                        <DollarIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText>{dataObject.start} : <ColoredText text={numericalStyling(totalExpensesYear[0])} color={getPartyColor(mpDropdown.party).backgroundColor} /></ListItemText>
                  </ListItem>) : ''}
                {numericalStyling(totalExpensesYear[1]) !== 'NaN' && parliamentNumber >= 40 ? (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={getPartyColor(mpDropdown.party)}>
                        <DollarIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText>{dataObject.start + 1} : <ColoredText text={numericalStyling(totalExpensesYear[1])} color={getPartyColor(mpDropdown.party).backgroundColor} /></ListItemText>
                  </ListItem>) : ''}
                {numericalStyling(totalExpensesYear[2]) !== 'NaN' && parliamentNumber >= 40 ? (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={getPartyColor(mpDropdown.party)}>
                        <DollarIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText>{dataObject.start + 2} : <ColoredText text={numericalStyling(totalExpensesYear[2])} color={getPartyColor(mpDropdown.party).backgroundColor} /></ListItemText>
                  </ListItem>) : ''}
                {numericalStyling(totalExpensesYear[3]) !== 'NaN' && parliamentNumber >= 40 ? (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={getPartyColor(mpDropdown.party)}>
                        <DollarIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText>{dataObject.start + 3} : <ColoredText text={numericalStyling(totalExpensesYear[3])} color={getPartyColor(mpDropdown.party).backgroundColor} /></ListItemText>
                  </ListItem>) : ''}
                <Box m={2} />
                <DividerBlock
                  text='Legislative'
                  color={getPartyColor(mpDropdown.party).backgroundColor}
                  infoBubbleTitle='Number of Bills Sponsored by Members of this Party'
                  infoBubbleText={'This is a breakdown of the number of bills that were sponsored by members of the given party. We can see the total number of bills that were sponsored, as well as the portion of those that passed and entered into law, and the portion of those that were not voted into law. To see details about the bills your representative has voted on, go to the "My MP" tab'}
                  infoBubbleColor='white'
                />
                <Box m={2} />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={getPartyColor(mpDropdown.party)}>
                      <FormatListNumberedIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText> Total Voted Bills: <ColoredText text={nbBills} color={getPartyColor(mpDropdown.party).backgroundColor} /></ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={getPartyColor(mpDropdown.party)}>
                      <AssignmentIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    Total Issued Bills: <ColoredText text={nbPairedBills} color={getPartyColor(mpDropdown.party).backgroundColor} />
                  </ListItemText>
                </ListItem>
              </List>) : ''}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
