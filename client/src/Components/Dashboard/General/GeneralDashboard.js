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
import axios from 'axios'

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
    minWidth: 275
  },
  pos: {
    marginBottom: 12
  },
  navbarCustomFont: {
    color: '#D71921',
    fontWeight: 'bold'
  },
  search: {
    paddingBottom: '30px'
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
    color: 'white'
  },
  image: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2)
  }
}))

export async function getMinisters () {
  let result = ''
  await axios
    .get('http://localhost:5000/api/representatives/getCabinetMinisters')
    .then(res => {
      if (res.data.success) {
        result = res.data.data
      }
    })
    .catch(err => console.error(err))
  return result
}

export default function GeneralDashboard () {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [ministerOpen, setMinisterOpen] = React.useState(false)
  const [currentMinister, setCurrentMinister] = React.useState('')
  const [filter, setFilter] = React.useState('')
  const [ministers, setMinisters] = React.useState([])
  const [filteredMinisters, setFilteredMinisters] = React.useState([])

  useEffect(() => {
    let mins = []
    async function getData () {
      mins = await getMinisters()
      setMinisters(mins)
      setFilteredMinisters(mins)
    }
    getData()
  }, [])

  useEffect(() => {
    let filteredMin = []
    if (filter === '') {
      filteredMin = ministers
    } else {
      filteredMin = ministers.filter(minister => minister.subheader.toLowerCase().includes(filter.toLowerCase()))
    }
    setFilteredMinisters(filteredMin)
  }, [filter,ministers])

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
    setCurrentMinister(minister)
    setMinisterOpen(true)
  }

  const handleMinisterClose = () => {
    setMinisterOpen(false)
  }

  return (
    <Grid>
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
              <span className={classes.navbarCustomFont}>Liberal Minority </span><HelpIcon className={classes.help} color='primary' onClick={handleClickOpen} />
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant='h5' color='textPrimary' gutterBottom>
                  Seats in Parliament
            </Typography>
            <Grid container>
              <Grid item xs={9}>
                {Array.apply(null, { length: 31 }).map((e, i) => (
                  <span key={i}><FiberManualRecordIcon style={{ fontSize: 30, color: '#D71921' }} /></span>))}
                {Array.apply(null, { length: 24 }).map((e, i) => (
                  <span key={i}><FiberManualRecordIcon style={{ fontSize: 30, color: '#0C499C' }} /></span>))}
                {Array.apply(null, { length: 6 }).map((e, i) => (
                  <span key={i}><FiberManualRecordIcon style={{ fontSize: 30, color: '#02819E' }} /></span>))}
                {Array.apply(null, { length: 5 }).map((e, i) => (
                  <span key={i}><FiberManualRecordIcon style={{ fontSize: 30, color: '#EF7E52' }} /></span>))}
                <FiberManualRecordIcon style={{ fontSize: 30, color: '#2E8724' }} />
                <FiberManualRecordIcon style={{ fontSize: 30, color: 'black' }} />
              </Grid>
              <Grid item xs={3}>
                <Typography variant='body2' color='textPrimary'>
                  <span style={{ color: '#43D0C4' }}>Total</span> 338
                </Typography>
                <Typography variant='body2' color='textPrimary'>
                  <span style={{ color: '#D71921', fontWeight: 'bold' }}>Liberal</span> 157
                </Typography>
                <Typography variant='body2' color='textPrimary'>
                  <span style={{ color: '#0C499C', fontWeight: 'bold' }}>Conservative</span> 121
                </Typography>
                <Typography variant='body2' color='textPrimary'>
                  <span style={{ color: '#02819E', fontWeight: 'bold' }}>Bloc Quebecois</span> 32
                </Typography>
                <Typography variant='body2' color='textPrimary'>
                  <span style={{ color: '#EF7E52', fontWeight: 'bold' }}>NDP</span> 24
                </Typography>
                <Typography variant='body2' color='textPrimary'>
                  <span style={{ color: '#2E8724', fontWeight: 'bold' }}>Green</span> 3
                </Typography>
                <Typography variant='body2' color='textPrimary'>
                  <span style={{ fontWeight: 'bold' }}>Independent</span> 1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Container className={classes.prime}>
        <Card>
          <CardHeader
            title='Justin Trudeau'
            subheader='Prime Minister'
            titleTypographyProps={{ align: 'center' }}
            subheaderTypographyProps={{ align: 'center' }}
            className={classes.cardHeader}
          />
          <CardContent>
            <div className={classes.image}>
              <RepresentativeImage representativeToLoad='justin trudeau' />
            </div>
            <ul>
              <Typography component='li' variant='subtitle1' align='center'>
                <span style={{ fontWeight: 'bold' }}>Year Elected</span> 2019
              </Typography>
              <Typography component='li' variant='subtitle1' align='center'>
                <span style={{ fontWeight: 'bold' }}>Riding</span> Papineau
              </Typography>
              <Typography component='li' variant='subtitle1' align='center'>
                <Link href='https://pm.gc.ca/en/cabinet/right-honourable-justin-trudeau'>More information</Link>
              </Typography>
            </ul>
          </CardContent>
        </Card>
      </Container>
      {/* eslint-disable */}
      <Container>
        <TextField label='Filter by Ministry' className={classes.search} variant='outlined' onChange={handleFilterChange} color='primary' />
        <Grid container spacing={5} alignItems='flex-end'>
          {filteredMinisters && filteredMinisters.length > 0
            ? filteredMinisters.map(minister => (
              <Grid item key={minister.title} xs={4}>
                <Card>
                  <CardHeader
                    title={minister.title}
                    subheader={minister.subheader}
                    titleTypographyProps={{ align: 'center' }}
                    subheaderTypographyProps={{ align: 'center' }}
                    action=<HelpIcon style={{ cursor: 'pointer' }} onClick={() => handleMinisterClickOpen(minister.id)} />
                    className={classes.cardHeader}
                  />
                  <CardContent>
                    <div className={classes.image}>
                      <RepresentativeImage representativeToLoad={minister.title.toLowerCase()} />
                    </div>
                    <ul>
                      <Typography component='li' variant='subtitle1' align='center'>
                        <span style={{ fontWeight: 'bold' }}>Minister Since</span> {minister.description[0]}
                      </Typography>
                      <Typography component='li' variant='subtitle1' align='center'>
                        <span style={{ fontWeight: 'bold' }}>Riding</span> {minister.description[1]}
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
      <MinisterHelpDialog minister={currentMinister} open={ministerOpen} onClose={handleMinisterClose} transition={Transition} />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
      >
        <DialogTitle>What is a minority government?</DialogTitle>
        <DialogContent>
          <DialogContentText>
              In Canada's parliamentary system of responsible government, minority governments occur when no party has a majority of seats in the legislature.
              Typically, but not necessarily, the party with a plurality of seats forms the government.
              In a minority situation, governments must rely on the support of other parties to stay in power, providing less stability than a majority government.
              In Canada, political parties rarely form official coalition governments to form a majority.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}
