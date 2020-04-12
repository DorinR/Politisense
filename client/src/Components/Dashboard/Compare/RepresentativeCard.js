/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Skeleton from '@material-ui/lab/Skeleton'
import CardContent from '@material-ui/core/CardContent'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import RepresentativeImage from '../Sidebar/RepresentativeImage'
import MpSwitcher from './MpSwitcher'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import { fetchRidingCode} from "../Utilities/CommonUsedFunctions";
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
  const [representative, setRepresentative] = useState(null)

  const updateNameFromSwitcher = newName => {
    setName(newName)
    updateHead(newName)
  }

  useEffect(() => {
    if (name) {
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
        const rep = await getRepInfo(name)
        setRepresentative(rep)
        const bills = await getAllBillsByHead(name)
        const total = await calculateTotalVotesBills(bills)
        setTotalBills(total)
        setRiding(representative.riding)
        const riding = representative.riding
        setYearElected(representative.yearElected)
        setPoliticalParty(representative.politicalParty)
        const ridingCode = await fetchRidingCode(riding)
        setRidingCode(ridingCode)
        const issuedBillsByHead = await getIssuedBillsByHead(name)
        if (issuedBillsByHead.length !== 0) {
          setIssuedBills(issuedBillsByHead.length)
        }
      }
      getData(name)
    }
  }, [name, riding, politicalParty, yearElected, issuedBills])
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} align='center'>
        <MpSwitcher functionUpdate={updateNameFromSwitcher} />
      </Grid>
      <Grid item xs={12} align='center'>
        <Card className={classes.card}>
          <CardContent>
            <Grid container justify='center'>
              <Grid item xs={12}>
                {representative ? (
                  <RepresentativeImage
                    align='center'
                    representative={representative}
                  />
                ) : null}
              </Grid>
            </Grid>
            {ridingCode ? (
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
                      <LocationOnIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>{capitalize(riding)}</ListItemText>
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <CalendarTodayIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>Elected in {yearElected}</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <FormatListNumberedIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText> Total Voted Bills: {totalBills}</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <AssignmentIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    {' '}
                    Total Issued Bills: {issuedBills}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <MapIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <Box m={1} />
                  <RidingShapeContainer
                    ridingCode={ridingCode}
                    politicalParty={politicalParty}
                  />
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
function calculateTotalVotesBills(bills) {
  let totalBills = 0
  if (bills) {
    bills.forEach(bill => totalBills++)
  }
  return totalBills
}
