import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Skeleton from '@material-ui/lab/Skeleton'
import CardContent from '@material-ui/core/CardContent'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import RepresentativeImage from './Sidebar/RepresentativeImage'
import MpsSwitcher from './MpsSwitcher'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import { fetchRidingCode } from './Sidebar/RepresentativeInfo'
import axios from 'axios'
import Box from '@material-ui/core/Box'
import RidingShapeContainer from './Sidebar/RidingShape/RidingShapeContainer'
import { getAllBillsByHead } from './/HeadToHeadComparison'
import Grid from '@material-ui/core/Grid'
import FlagIcon from '@material-ui/icons/Flag'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import MapIcon from '@material-ui/icons/Map'
import AssignmentIcon from '@material-ui/icons/Assignment'

const useStyles = makeStyles({
  card: {
    width: 250
  },
  avatar: {
    backgroundColor: '#43D0C4'
  }
})

function capitalize (str) {
  if (str && isNaN(str)) {
    let res = str
    res = res.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
    return res
  }
  return null
}

export default function HeadInfo (props) {
  // eslint-disable-next-line no-unused-vars
  const { updateHead, ...other } = props
  const classes = useStyles()

  const [skeleton] = useState([1, 2, 3, 4, 5])

  const [name, setName] = useState(null)
  const updateNameFromSwitcher = (newName) => {
    setName(newName)
    updateHead(newName)
  }

  const [mp, setMP] = useState(null)
  useEffect(() => {
    async function getData () {
      if (name) {
        const mp = await getRepInfo(name)
        setMP(mp)
      }
    }
    getData()
  }, [name])

  async function getRepInfo (name) {
    const res = await axios.get(`http://localhost:5000/api/representatives/${name}/getRepresentativesInfo`)
    return res.data.data
  }

  const [yearElected, setYearElected] = useState(null)
  useEffect(() => {
    if (mp) {
      setYearElected(mp.yearElected)
    }
  }, [mp])

  const [politicalParty, setpoliticalParty] = useState(null)
  useEffect(() => {
    if (mp) {
      setpoliticalParty(mp.politicalParty)
    }
  }, [mp])

  const [bills, setBills] = useState(null)
  useEffect(() => {
    async function getData () {
      if (name) {
        const bills = await getAllBillsByHead(name)
        setBills(bills)
      }
    }
    getData()
  }, [name])

  const [totalBills, setTotalBills] = useState(null)
  useEffect(() => {
    if (bills) {
      const total = calculateTotalVotesBills(bills)
      setTotalBills(total)
    }
  }, [bills])

  function calculateTotalVotesBills (bills) {
    let totalBills = 0
    if (bills) {
      bills.forEach(bill => totalBills++)
    }
    return totalBills
  }

  const [issuedBills, setIssuedBills] = useState(null)
  useEffect(() => {
    async function getData () {
      if (name) {
        const issued = await getIssuedBillsByHead(name)
        setIssuedBills(issued.length)
      }
    }
    getData()
  }, [name])

  async function getIssuedBillsByHead (head) {
    const res = await axios.get(`http://localhost:5000/api/bills/${head}/getAllBillsBySponsorName`)
    return res.data.data
  }

  const [ridingCode, setRidingCode] = useState('')
  useEffect(() => {
    async function getData () {
      if (mp) {
        const ridingCode = await fetchRidingCode(mp.riding)
        setRidingCode(ridingCode)
      }
    }
    getData()
  }, [mp])

  /* eslint-disable */
  return (
      <Grid container spacing={2}>
        <Grid item>
          <MpsSwitcher functionUpdate={updateNameFromSwitcher} />
        </Grid>
        <Grid item>
    <Card className={classes.card} >
        <CardContent>
          <Grid container justify="center" style={{paddingLeft: '12px'}}>
            <Grid item xs={12}>
              { mp ?
              <RepresentativeImage align="center" representativeToLoad={mp.riding}/>
              :
              <div /> }
            </Grid>
          </Grid>
          {ridingCode ? (<List>
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
                  <LocationOnIcon/>
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                {capitalize(mp.name)}
              </ListItemText>
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
                  <ListItemText> Total Issued Bills: {issuedBills}</ListItemText>
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
          </List>) :
              <Grid item style={{paddingTop: '10px'}}>
                {skeleton.map((skeleton) => {
                  return <Skeleton animation={false}/>;
                })}
              </Grid>}
        </CardContent>
    </Card>
        </Grid>
      </Grid>
  )
}