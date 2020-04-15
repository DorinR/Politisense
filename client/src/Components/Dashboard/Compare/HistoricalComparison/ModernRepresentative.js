import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import DollarIcon from '@material-ui/icons/Money'
import axios from 'axios'
import {
  getAllBillsByHead,
  capitalizedName,
  fetchUserRiding,
  getPartyColor,
  getPartyData,
  numericalStyling
} from '../../Utilities/CommonUsedFunctions'
import Grid from '@material-ui/core/Grid'
import FlagIcon from '@material-ui/icons/Flag'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import AssignmentIcon from '@material-ui/icons/Assignment'
import Box from '@material-ui/core/Box'
import DividerBlock from '../../Utilities/DividerBlock'
import ColoredText from '../../Utilities/ColoredText'

const useStyles = makeStyles({
  avatar: {
    backgroundColor: '#00BCD4'
  },
  card: {
    width: 420
  }
})

async function fetchCurrentRepresentative (riding) {
  return axios
    .get(`/api/representatives/${riding}/getRepresentative`)
    .then((res) => {
      if (res.data.success) {
        return res.data.data
      }
      return null
    })
    .catch(console.error)
}

async function fetchRepresentativeId (representative) {
  return axios
    .get(`/api/representatives/${representative}/getRepresentativeId`)
    .then((res) => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

async function fetchRepresentativeSpending (member, data) {
  const res = await axios.post(
    `/api/budgets/budget/${member}/fetchMemberExpenditures`,
    data
  )
  return res.data.data
}

export default function ModernRepresentative () {
  const classes = useStyles()
  const [totalBills, setTotalBills] = useState(null)
  const [issuedBills, setIssuedBills] = useState(null)
  const [currentRepresentative, setCurrentRepresentative] = useState(null)
  const [politicalParty, setPoliticalParty] = useState(null)
  const [partyImageUrl, setPartyImageUrl] = useState('')
  const [spending, setSpending] = useState(null)
  const [representativeImage, setRepresentativeImage] = useState('')
  const [user, setUser] = useState(null)
  const [riding, setRiding] = useState(null)

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line no-undef
      const usr = JSON.parse(localStorage.getItem('user'))
      setUser(usr)
    }
  }, [user])

  useEffect(() => {
    async function getData () {
      // eslint-disable-next-line no-undef
      const riding = await fetchUserRiding(user.email)
      setRiding(riding)
    }
    if (user) {
      getData()
    }
  }, [user])

  useEffect(() => {
    async function getData () {
      const cr = await fetchCurrentRepresentative(riding)
      setRepresentativeImage(cr.imageUrl)
      setCurrentRepresentative(cr)
    }
    if (riding) {
      getData()
    }
  }, [riding])

  useEffect(() => {
    async function getData () {
      // eslint-disable-next-line no-undef
      const member = await fetchRepresentativeId(currentRepresentative.name)
      const parliamentData = { parliament: 43 }
      const spending = await fetchRepresentativeSpending(member, parliamentData)
      setSpending(spending)
    }
    if (currentRepresentative) {
      getData()
    }
  }, [currentRepresentative])

  useEffect(() => {
    async function getData (mp) {
      async function getIssuedBillsByHead (head) {
        const res = await axios.get(
          `/api/bills/${head}/getAllBillsBySponsorName`
        )
        return res.data.data
      }
      const bills = await getAllBillsByHead(currentRepresentative.name)
      if (Number.isInteger(bills)) {
        setTotalBills(bills)
      }
      setPoliticalParty(currentRepresentative.party)
      const partyData = await getPartyData(currentRepresentative.party)
      setPartyImageUrl(partyData.imageUrl)
      const issuedBillsByHead = await getIssuedBillsByHead(
        currentRepresentative.name
      )
      if (Number.isInteger(issuedBillsByHead)) {
        setIssuedBills(issuedBillsByHead)
      }
    }
    if (currentRepresentative) {
      getData()
    }
  }, [currentRepresentative])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} align='center' style={{ marginTop: 57 }}>
        <Card className={classes.card} style={{ marginTop: 57 }}>
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
                    border: '3px solid #00BCD4'
                  }}
                />
              </Grid>
              <Grid item xs={9}>
                <Avatar
                  alt={currentRepresentative}
                  src={representativeImage}
                  style={{
                    marginLeft: 26,
                    width: 150,
                    height: 150,
                    border: '3px solid #00BCD4'
                  }}
                  className={classes.bigAvatar}
                />
              </Grid>
            </Grid>
            {currentRepresentative && politicalParty ? (
              <List>
                <DividerBlock
                  text='Profile'
                  color={getPartyColor(politicalParty).backgroundColor}
                />
                <Box m={3} />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={getPartyColor(politicalParty)}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    {capitalizedName(currentRepresentative.name)}
                  </ListItemText>
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
                <DividerBlock
                  text='Spending'
                  color={getPartyColor(politicalParty).backgroundColor}
                  infoBubbleTitle='Cumulative spending to this point in time'
                  infoBubbleText='Only available data is displayed'
                  infoBubbleColor='white'
                />
                <Box m={2} />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={getPartyColor(politicalParty)}>
                      <DollarIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    Year-to-Date Expenditures :{' '}
                    <ColoredText
                      text={numericalStyling(spending)}
                      color={getPartyColor(politicalParty).backgroundColor}
                    />
                  </ListItemText>
                </ListItem>
                <Box m={2} />
                <DividerBlock
                  text='Legislative'
                  color={getPartyColor(politicalParty).backgroundColor}
                  infoBubbleTitle='Number of Bills Sponsored by Members of this Party'
                  infoBubbleText={
                    // eslint-disable-next-line
                    'This is a breakdown of the number of bills that were sponsored by members of the given party. We can see the total number of bills that were sponsored, as well as the portion of those that passed and entered into law, and the portion of those that were not voted into law. To see details about the bills your representative has voted on, go to the "My MP" tab'
                  }
                  infoBubbleColor='white'
                />
                <Box m={2} />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={getPartyColor(politicalParty)}>
                      <FormatListNumberedIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    Voted Bills to Date:{' '}
                    <ColoredText
                      text={totalBills}
                      color={getPartyColor(politicalParty).backgroundColor}
                    />
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={getPartyColor(politicalParty)}>
                      <AssignmentIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    {' '}
                    Issued Bills to Date:{' '}
                    <ColoredText
                      text={issuedBills}
                      color={getPartyColor(politicalParty).backgroundColor}
                    />
                  </ListItemText>
                </ListItem>
              </List>
            ) : (
              ''
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
