import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Alert from '@material-ui/lab/Alert'
import { getIpPostalCode } from './GetIpAddress'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import { fetchUserData } from '../Utilities/CommonUsedFunctions'

const useStyles = makeStyles({
  card: {
    width: 500
  },
  avatar: {
    backgroundColor: '#43D0C4'
  },
  title: {
    fontSize: 18,
    color: '#000000'
  },
  date: {
    marginBottom: 16,
    fontSize: 10
  },
  link: {
    fontSize: 14,
    color: '#1e90ff'
  },
  details: {
    fontSize: 14
  },
  description: {
    fontSize: 16
  },
  for: {
    backgroundColor: '#008000',
    color: 'white',
    marginLeft: 10,
    marginTop: 10,
    '&:hover': {
      backgroundColor: '#aee6ae',
      color: 'black'
    }
  },
  against: {
    backgroundColor: '#8b0000',
    color: 'white',
    marginLeft: 20,
    marginTop: 10,
    '&:hover': {
      backgroundColor: '#eba4a4',
      color: 'black'
    }
  },
  alert: {
    fontSize: 14,
    marginTop: 20,
    marginBlock: 10
  }
})

export default function Voting () {
  const classes = useStyles()
  const [recentBills, setRecentBills] = useState([])
  const [storagePostalCode, setStoragePostalCode] = useState('')
  const [ipPostalCode, setIpPostalCode] = useState('')
  const preventDefault = (event) => event.preventDefault()
  const [userEmail, setUserEmail] = useState('')
  const [hasNotClicked, setHasNotClicked] = useState([])
  const [filter, setFilter] = useState('')
  const [filteredBills, setfilteredBills] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line
      const usr = JSON.parse(localStorage.getItem('user'))
      setUser(usr)
    }
  }, [user])

  useEffect(() => {
    async function getData () {
      const userDetails = await fetchUserData(user.email)
      const postalCode = userDetails.postalCode.substring(0, 3)
      setStoragePostalCode(postalCode)
      setUserEmail(userDetails.email)
    }
    if (user) {
      getData()
    }
  }, [user])

  useEffect(() => {
    async function getData () {
      const ipAddress = await getIpPostalCode()
      setIpPostalCode(ipAddress)
      const recentLegislativeActivities = await fetchVotingActivity(user.email)
      setRecentBills(recentLegislativeActivities.slice(0, 100))
    }
    if (user) {
      getData()
    }
  }, [user])

  useEffect(() => {
    let filtered
    if (filter === '') {
      filtered = recentBills
    } else {
      filtered = recentBills.filter((bills) => {
        return bills.title.toLowerCase().includes(filter.toLowerCase())
      }
      )
    }
    setfilteredBills(filtered)
  }, [filter, recentBills])

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const registerButtonClick = (event, number, title, link, description, date, index) => {
    event.preventDefault()
    if (event.currentTarget.value === 'yes') {
      // eslint-disable-next-line
      alert('You voted For this bill. Reload to see results')
    }
    if (event.currentTarget.value === 'no') {
      // eslint-disable-next-line
      alert('You voted Against this bill. Reload to see results')
    }

    registerVote(userEmail, number, title, link, description, date, event.currentTarget.value, index)
  }

  async function fetchVotingActivity (userEmail) {
    return axios
      .post('/api/voting/index',
        {
          user: { email: userEmail }

        })
      .then(res => {
        if (res.data.success) {
          return res.data.data
        }
        return null
      })
      .catch(console.error)
  }

  async function registerVote (userEmail, number, title, link, description, date, vote, index) {
    await axios.post('/api/voting/vote',
      {

        user: { email: userEmail },
        activity: { number: number, title: title, link: link, description: description, date: date },
        vote: vote

      })
      .then(res => {
        if (res.data.success) {
          setHasNotClicked([...hasNotClicked, index])
        }
      })
      .catch(err => console.log(err))
  }

  return (
    <Grid>
      <TextField
        label='Filter through bills'
        className={classes.search}
        variant='outlined'
        onChange={handleFilterChange}
        color='primary'
      />
      {filteredBills && filteredBills.length > 0 ? (
        <Grid item xs={12} align='center'>
          <List className={classes.root}>
            {filteredBills.map((bill, index) => (
              <ListItem key={index} value={bill}>
                <ListItemAvatar>
                  <Avatar src='http://www.pngall.com/wp-content/uploads/2016/07/Canada-Leaf-PNG-Clipart.png' />
                </ListItemAvatar>
                <Card className={classes.root}>
                  <CardContent>
                    <Typography className={classes.title} color='primary' gutterBottom>
                      {bill.title}
                    </Typography>
                    <Typography className={classes.date}> Retrieved on {bill.date}</Typography>
                    <CardActions>
                      <Typography className={classes.details}> Get more details </Typography>
                      <Typography className={classes.link}>
                        <Link href={bill.link} onClick={preventDefault} className={classes.link}>
                          {bill.link}
                        </Link>
                      </Typography>
                    </CardActions>
                    <Typography variant='body2' component='p'> {bill.description} </Typography>
                    {storagePostalCode === ipPostalCode && bill.description !== '' ? (
                      <Alert className={classes.alert} severity='error'>
                                                  Read the bill properly. Once you cast your vote, it cannot be undone!
                      </Alert>) : ''}
                    {storagePostalCode === ipPostalCode && bill.userHasVoted === false && bill.description !== '' ? (
                      <ButtonGroup>
                        <Button value='yes' id={index} className={classes.for} onClick={(event) => registerButtonClick(event, bill.number, bill.title, bill.link, bill.description, bill.date, index)}>For</Button>
                        <Button value='no' id={index} className={classes.against} onClick={(event) => registerButtonClick(event, bill.number, bill.title, bill.link, bill.description, bill.date, index)}>Against</Button>
                      </ButtonGroup>) : ''}
                    {bill.description !== '' && bill.userHasVoted === true ? (
                      <List component='nav' className={classes.root} aria-label='mailbox folders'>
                        <ListItem>
                          <ListItemText primary='For' /> {bill.yes}
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText primary='Against' /> {bill.no}
                        </ListItem>
                      </List>) : ''}
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        </Grid>
      ) : (
        <Typography variant='h5' component='h2'>
                        No Results Found
        </Typography>
      )}
    </Grid>
  )
}
