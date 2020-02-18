/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Skeleton from '@material-ui/lab/Skeleton'
import CardContent from '@material-ui/core/CardContent'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import PartySwitcher from './PartySwitcher'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import { fetchRidingCode } from '../../Sidebar/RepresentativeInfo'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import FlagIcon from '@material-ui/icons/Flag'
import EventSeatIcon from '@material-ui/icons/EventSeat'
import DescriptionIcon from '@material-ui/icons/Description'
import capitalize from 'capitalize'

const useStyles = makeStyles(theme => ({
  bigAvatar: {
    marginLeft: 26,
    width: 150,
    height: 150,
    border: '3px solid #41aaa8'
  },
  card: {
    width: 350
  },
  avatar: {
    backgroundColor: '#43D0C4'
  }
}))

async function getPartyData(party) {
  return axios
    .get(
      `http://localhost:5000/api/parties/${party.toLowerCase()}/getAllPartydata`
    )
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

async function getNumberOfBillsSponsoredByParty(party) {
  return axios
    .get(
      `http://localhost:5000/api/bills/${party.toLowerCase()}/getNumberOfBillsSponsoredByParty`
    )
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

async function getSpendingItemsForParty(party) {
  return axios
    .get(
      `http://localhost:5000/api/financialRecords/${party.toLowerCase()}/getAllSpendingItemsForParty`
    )
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

export function getSpendingCategoriesAverages(spendingItems) {
  let [
    salariesAverage,
    serviceAverage,
    travelAverage,
    hospitalityAverage,
    giftsAverage,
    advertisingAverage,
    salariesItemsCount,
    salariesTotal,
    serviceItemsCount,
    serviceTotal,
    travelItemsCount,
    travelTotal,
    hospitalityItemsCount,
    hospitalityTotal,
    giftsItemsCount,
    giftsTotal,
    advertisingItemsCount,
    advertisingTotal
  ] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  spendingItems.forEach(item => {
    switch (item.category) {
      case "1-Employees' salaries":
        salariesItemsCount++
        salariesTotal += item.amount
        break
      case '2-Service Contracts':
        serviceItemsCount++
        serviceTotal += item.amount
        break
      case '3-Travel':
        travelItemsCount++
        travelTotal += item.amount
        break
      case '4-Hospitality':
        hospitalityItemsCount++
        hospitalityTotal += item.amount
        break
      case '5-Gifts':
        giftsItemsCount++
        giftsTotal += item.amount
        break
      case '6-Advertising':
        advertisingItemsCount++
        advertisingTotal += item.amount
        break
    }
  })

  salariesAverage = parseInt(salariesTotal / salariesItemsCount)
  serviceAverage = parseInt(serviceTotal / serviceItemsCount)
  travelAverage = parseInt(travelTotal / travelItemsCount)
  hospitalityAverage = parseInt(hospitalityTotal / hospitalityItemsCount)
  giftsAverage = parseInt(giftsTotal / giftsItemsCount)
  advertisingAverage = parseInt(advertisingTotal / advertisingItemsCount)

  return {
    salariesAverage,
    serviceAverage,
    travelAverage,
    hospitalityAverage,
    giftsAverage,
    advertisingAverage
  }
}

export default function Party(props) {
  const { updateHead, ...other } = props
  const classes = useStyles()
  const [politicalParty, setPoliticalParty] = useState('')
  const [riding, setRiding] = useState('')
  const [yearElected, setYearElected] = useState(0)
  const [totalBills, setTotalBills] = useState(0)
  const [ridingCode, setRidingCode] = useState('')
  const [skeleton] = useState([1, 2, 3, 4, 5])
  const [issuedBills, setIssuedBills] = useState(0)

  // General
  const [party, setParty] = useState('')
  const [partyImageUrl, setPartyImageUrl] = useState('')
  // Seats Held
  const [seatsHeld, setSeatsHeld] = useState('')
  // Legislative Performance
  const [nbBillsAuthored, setNbBillsAuthored] = useState(0)
  const [nbBillsSucceeded, setNbBillsSucceeded] = useState(0)
  const [nbBillsFailed, setNbBillsFailed] = useState(0)
  const [totalSpending, setTotalSpending] = useState(0)
  // Spending
  const [averageSalariesSpending, setAverageSalariesSpending] = useState(0)
  const [averageServiceSpending, setAverageServiceSpending] = useState(0)
  const [averageTravelSpending, setAverageTravelSpending] = useState(0)
  const [averageHospitalitySpending, setAverageHospitalitySpending] = useState(
    0
  )
  const [averageGiftsSpending, setAverageGiftsSpending] = useState(0)
  const [averageAdvertisingSpending, setAverageAdvertisingSpending] = useState(
    0
  )

  useEffect(() => {
    async function getData() {
      const partyData = await getPartyData(party)
      setPartyImageUrl(partyData.imageUrl)
      setSeatsHeld(partyData.numberOfSeats)
      const numberOfBillsSponsored = await getNumberOfBillsSponsoredByParty(
        party
      )
      setNbBillsAuthored(numberOfBillsSponsored.totalBills)
      setNbBillsSucceeded(numberOfBillsSponsored.billsSucceeded)
      setNbBillsFailed(
        numberOfBillsSponsored.totalBills -
          numberOfBillsSponsored.billsSucceeded
      )
    }
    if (party) {
      getData()
    }
  }, [party])

  useEffect(() => {
    async function getData() {
      const spendingItems = await getSpendingItemsForParty(party)
      const {
        salariesAverage,
        serviceAverage,
        travelAverage,
        hospitalityAverage,
        giftsAverage,
        advertisingAverage
      } = getSpendingCategoriesAverages(spendingItems)
      setAverageSalariesSpending(salariesAverage)
      setAverageServiceSpending(serviceAverage)
      setAverageTravelSpending(travelAverage)
      setAverageHospitalitySpending(hospitalityAverage)
      setAverageGiftsSpending(giftsAverage)
      setAverageAdvertisingSpending(advertisingAverage)
    }

    if (party) {
      getData()
    }
  }, [party])

  const updatePartyFromSwitcher = newParty => {
    setParty(newParty)
    updateHead(newParty)
  }

  useEffect(() => {
    if (party) {
      async function getRepInfo(name) {
        const res = await axios.get(
          `http://localhost:5000/api/representatives/${name}/getRepresentativesInfo`
        )
        return res.data.data
      }
      async function getIssuedBillsByHead(head) {
        const res = await axios.get(
          `http://localhost:5000/api/bills/${head}/getAllBillsBySponsorName`
        )
        return res.data.data
      }
      async function getData(name) {
        // eslint-disable-next-line
        const riding = await getRepInfo(name)
        const total = await calculateTotalVotesBills(bills)
        setTotalBills(total)
        setRiding(riding.riding)
        const test = riding.riding
        setYearElected(riding.yearElected)
        setPoliticalParty(riding.politicalParty)
        const ridingCode = await fetchRidingCode(test)
        setRidingCode(ridingCode)
        const issuedBillsByHead = await getIssuedBillsByHead(name)
        if (issuedBillsByHead.length != 0) {
          setIssuedBills(issuedBillsByHead.length)
        }
      }
      getData(party)
    }
  }, [party, riding, politicalParty, yearElected, issuedBills])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} align='center'>
        <PartySwitcher functionUpdate={updatePartyFromSwitcher} />
      </Grid>
      <Grid item xs={12} align='center'>
        <Card className={classes.card}>
          <CardContent>
            <Grid container justify='center'>
              <Grid item xs={12}>
                <Avatar
                  alt={party}
                  src={partyImageUrl}
                  className={classes.bigAvatar}
                />
              </Grid>
            </Grid>
            {party ? (
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <FlagIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>{capitalize(party)}</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <EventSeatIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>{'Number of seats: ' + seatsHeld}</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <DescriptionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    {'Number of Bills Authored: ' + nbBillsAuthored}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <DescriptionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    {'Number of Bills Succeeded: ' + nbBillsSucceeded}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <DescriptionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    {'Number of Bills Failed: ' + nbBillsFailed}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <DescriptionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    {'Average Spending by MP: ' + totalSpending}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <DescriptionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    {'Average Spending on Salaries: ' + averageSalariesSpending}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <DescriptionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    {'Average Spending on Service: ' + averageServiceSpending}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <DescriptionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    {'Average Spending on Travel: ' + averageTravelSpending}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <DescriptionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    {'Average Spending on Hospitality: ' +
                      averageHospitalitySpending}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <DescriptionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    {'Average Spending on Gifts: ' + averageGiftsSpending}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <DescriptionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    {'Average Spending on Advertising: ' +
                      averageAdvertisingSpending}
                  </ListItemText>
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
function calculateTotalVotesBills(bills) {
  let totalBills = 0
  if (bills) {
    bills.forEach(bill => totalBills++)
  }
  return totalBills
}
