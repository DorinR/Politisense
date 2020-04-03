import React, { useEffect } from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import HelpIcon from '@material-ui/icons/Help'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import CardContent from '@material-ui/core/CardContent'
import 'typeface-roboto'
import RepresentativeImage from '../Sidebar/RepresentativeImage'
import MinisterHelpDialog from './MinisterHelpDialog'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'

const capitalize = require('capitalize')

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const useStyles = makeStyles(theme => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none'
    }
  },
  card: {
    height: 400
  },
  search: {
    marginBottom: '30px',
    backgroundColor: 'white'
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  content: {
    padding: theme.spacing(8, 0, 6)
  },
  prime: {
    marginTop: '30px',
    marginBottom: '30px',
    width: '45%'
  },
  help: {
    cursor: 'pointer'
  },
  cardHeader: {
    backgroundColor: '#43D0C4',
    color: 'white',
    height: '100px'
  },
  image: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2)
  }
}))

export function titleCase (str) {
  const regex = /(^|\b(?!(and?|at?|the|for|to|but|by|of)\b))\w+/g
  return str.toLowerCase()
    .replace(regex, s => s[0].toUpperCase() + s.slice(1))
}

export function getLink (str) {
  const nameArr = str.split(' ')
  return 'https://pm.gc.ca/en/cabinet/right-honourable-' + nameArr[0] + '-' + nameArr[nameArr.length - 1]
}

export default function GeneralDashboard () {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [ministerOpen, setMinisterOpen] = React.useState(false)
  const [currentMinistry, setCurrentMinistry] = React.useState('')
  const [filter, setFilter] = React.useState('')
  const [parties, setParties] = React.useState([])
  const [ministers, setMinisters] = React.useState([])
  const [filteredMinisters, setFilteredMinisters] = React.useState([])
  const [primeMinister, setPrimeMinister] = React.useState(null)

  async function getMinisters () {
    return axios
      .get('/api/parliament/getCabinetMinisters')
      .then(res => {
        const result = []
        if (res.data.success) {
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].title === 'prime minister') {
              result.prime = res.data.data[i]
              setPrimeMinister(res.data.data[i])
              continue
            }
            result[i] = {}
            result[i].name = res.data.data[i].name
            result[i].title = res.data.data[i].title
            const fullNameArr = res.data.data[i].name.split(' ')
            const nameArr = []
            nameArr.push(fullNameArr[0])
            nameArr.push(fullNameArr[fullNameArr.length - 1])
            let linkName = ''
            for (let j = 0; j < nameArr.length; j++) {
              linkName += '-' + nameArr[j]
            }

            result[i].description = [res.data.data[i].fromDate, res.data.data[i].riding, 'https://pm.gc.ca/en/cabinet/honourable' + linkName]

            result[i].id = res.data.data[i].title
            result[i].data = res.data.data[i]
          }
        }
        return result
      })
      .catch(err => console.error(err))
  }

  async function getPartyInfo () {
    return axios
      .get('/api/parliament/getPartyInfo')
      .then(res => {
        if (res.data.success) {
          const result = []
          let max = 0
          for (let i = 0; i < res.data.data.length; i++) {
            result[i] = {}

            result[i].name = res.data.data[i].name
            result[i].seats = res.data.data[i].seats
            result[i].proportionalSeats = Math.ceil(res.data.data[i].seats / 8)
            switch (res.data.data[i].name) {
              case 'liberal':
                result[i].color = '#D71921'
                break
              case 'conservative':
                result[i].color = '#0C499C'
                break
              case 'ndp':
                result[i].color = '#EF7E52'
                break
              case 'bloc québécois':
                result[i].color = '#02819E'
                break
              case 'green party':
                result[i].color = '#2E8724'
                break
              case 'independent':
                result[i].color = 'black'
                break
              default:
                result[i].color = 'white'
            }
            if (res.data.data[i].seats > max) {
              max = res.data.data[i].seats
              result.current = result[i]
            }
          }
          if (max >= 170) {
            result.status = 'Majority'
          } else {
            result.status = 'Minority'
          }
          return result
        }
      })
      .catch(console.error)
  }

  useEffect(() => {
    async function getData () {
      const mins = await getMinisters()
      setMinisters(mins)
    }
    getData()
  }, [])

  useEffect(() => {
    async function getData () {
      const partyInfo = await getPartyInfo()
      setParties(partyInfo)
    }
    getData()
  }, [])

  useEffect(() => {
    let filteredMin
    if (filter === '') {
      filteredMin = ministers
    } else {
      filteredMin = ministers.filter(minister => minister.title.toLowerCase().includes(filter.toLowerCase()))
    }
    setFilteredMinisters(filteredMin)
  }, [filter, ministers])

  const handleFilterChange = e => {
    setFilter(e.target.value)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleMinisterClickOpen = (minister) => {
    setCurrentMinistry(minister)
    setMinisterOpen(true)
  }

  const handleMinisterClose = () => {
    setMinisterOpen(false)
  }

  return (
    <Grid>
      {ministers && ministers.length > 0 && parties && parties.length
        ? <div>
          <CssBaseline />
          <Container maxWidth='sm' component='main' className={classes.content}>
            <Typography component='h1' variant='h2' align='center' color='textPrimary' gutterBottom>
            Your Government
            </Typography>
          </Container>
          <Container maxWidth='md' component='main'>
            <Grid container>
              <Grid item xs={4}>
                <Typography variant='h5' color='textPrimary'>
                Current Government
                </Typography>
                <Typography variant='h4' color='textPrimary'>
                  <span style={{ fontWeight: 'bold', color: parties.current.color }}>{titleCase(parties.current.name)} {parties.status} </span><HelpIcon className={classes.help} color='primary' onClick={handleClickOpen} />
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant='h5' color='textPrimary' gutterBottom>
                  Seats in Parliament
                </Typography>
                <Grid container>
                  <Grid item xs={9}>
                    {parties.map((party) =>
                      Array.apply(null, { length: party.proportionalSeats }).map((e, i) => (
                        <span key={i}><FiberManualRecordIcon style={{ fontSize: 30, color: party.color }} /></span>))
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant='body2' color='textPrimary'>
                      <span style={{ color: '#43D0C4' }}>Total</span> 338
                    </Typography>
                    {parties.map((party) =>
                      <Typography key={party.name} variant='body2' color='textPrimary'>
                        <span style={{ color: party.color, fontWeight: 'bold' }}>{capitalize.words(party.name)}</span> {party.seats}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
          <Container className={classes.prime}>
            <Card>
              <CardHeader
                title={titleCase(ministers.prime.name)}
                subheader={titleCase(ministers.prime.title)}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                className={classes.cardHeader}
              />
              {primeMinister ? (
                <CardContent>
                  <div className={classes.image}>
                    <RepresentativeImage representative={primeMinister} />
                  </div>
                  <ul>
                    <Typography component='li' variant='subtitle1' align='center'>
                      <span style={{ fontWeight: 'bold' }}>Year Elected</span> {primeMinister.fromDate}
                    </Typography>
                    <Typography component='li' variant='subtitle1' align='center'>
                      <span style={{ fontWeight: 'bold' }}>Riding</span> {titleCase(primeMinister.riding)}
                    </Typography>
                    <Typography component='li' variant='subtitle1' align='center'>
                      <Link href={getLink(primeMinister.name)}>More information</Link>
                    </Typography>
                  </ul>
                </CardContent>
              ) : (
                <Grid container alignItems='center' justify='center'>
                  <Grid item>
                    <CircularProgress />
                  </Grid>
                </Grid>
              )}
            </Card>
          </Container>
          {/* eslint-disable */}
      <Container>
        <TextField label='Filter by Ministry' className={classes.search} variant='outlined' onChange={handleFilterChange} color='primary' />
        <Grid container spacing={5} alignItems='flex-end'>
          {filteredMinisters && filteredMinisters.length > 0
            ? filteredMinisters.map(minister => (
              <Grid item key={minister.title} xs={4}>
                <Card className={classes.card}>
                  <CardHeader
                    title={capitalize.words(minister.name)}
                    subheader={titleCase(minister.title)}
                    titleTypographyProps={{ align: 'center' }}
                    subheaderTypographyProps={{ align: 'center' }}
                    action=<HelpIcon style={{ cursor: 'pointer' }} onClick={() => handleMinisterClickOpen(titleCase(minister.title))} />
                    className={classes.cardHeader}
                  />
                  <CardContent>
                    <div className={classes.image}>
                      <RepresentativeImage representative={minister.data} />
                    </div>
                    <ul>
                      <Typography component='li' variant='subtitle1' align='center'>
                        <span style={{ fontWeight: 'bold' }}>Minister Since</span> {minister.description[0]}
                      </Typography>
                      <Typography component='li' variant='subtitle1' align='center'>
                        <span style={{ fontWeight: 'bold' }}>Riding</span> {capitalize.words(minister.description[1])}
                      </Typography>
                      <Typography component='li' variant='subtitle1' align='center'>
                        <Link href={minister.description[2]}>More information</Link>
                      </Typography>
                    </ul>
                  </CardContent>
                </Card>
              </Grid>
            )) : <Grid item xs={4}>
              <Typography variant='h5' component='h2'>
                          No Results Found
              </Typography>
            </Grid>}
        </Grid>
      </Container>
      </div> :  <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)' }}
          >
            <CircularProgress/>
          </div>}
      <MinisterHelpDialog ministry={currentMinistry} open={ministerOpen} onClose={handleMinisterClose} transition={Transition} />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
      >
        <DialogTitle>What is a {parties['status']} government?</DialogTitle>
        <DialogContent>
          {parties['status'] === 'Minority' ?
              <DialogContentText>
                In Canada's parliamentary system of responsible government, minority governments occur when no party has a majority of seats in the legislature.
                Typically, but not necessarily, the party with a plurality of seats forms the government.
                In a minority situation, governments must rely on the support of other parties to stay in power, providing less stability than a majority government.
                In Canada, political parties rarely form official coalition governments to form a majority.
              </DialogContentText>
              :
              <DialogContentText>
                A majority government refers to one or multiple governing parties that hold an absolute majority of seats in legislature.
                This is as opposed to a minority government, where the largest party in a legislature only has a plurality of seats.
                A majority government is usually assured of having its legislation passed and rarely, if ever, has to fear being defeated in parliament, a state
                also known as a working majority. In contrast, a minority government must constantly bargain for support from other parties in order to pass
                legislation and avoid being defeated on motions of no confidence.
              </DialogContentText>}
        </DialogContent>
      </Dialog>
    </Grid>
  )
}
