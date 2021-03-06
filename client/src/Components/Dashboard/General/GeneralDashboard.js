/* eslint-env react */
import React, { useEffect } from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Slide from '@material-ui/core/Slide'
import CardContent from '@material-ui/core/CardContent'
import 'typeface-roboto'
import HelpIcon from '@material-ui/icons/Help'
import RepresentativeImage from '../Sidebar/RepresentativeImage'
import MinisterHelpDialog from './MinisterHelpDialog'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import { titleCase } from '../Utilities/CommonUsedFunctions'
import SeatingPlan from './SeatingPlan'
import CenteredCircularProgress from '../Utilities/CenteredCircularProgress'
import useMediaQuery from '@material-ui/core/useMediaQuery'
const capitalize = require('capitalize')

export const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

async function getMinisters (setPrimeMinister) {
  return axios
    .get('/api/parliament/getCabinetMinisters')
    .then((res) => {
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

          result[i].description = [
            res.data.data[i].fromDate,
            res.data.data[i].riding,
            'https://pm.gc.ca/en/cabinet/honourable' + linkName
          ]

          result[i].id = res.data.data[i].title
          result[i].data = res.data.data[i]
        }
      }
      return result
    })
    .catch((err) => console.error(err))
}

async function getPartyInfo () {
  return axios
    .get('/api/parliament/getPartyInfo')
    .then((res) => {
      if (res.data.success) {
        const result = []
        let max = 0
        for (let i = 0; i < res.data.data.length; i++) {
          result[i] = {}

          result[i].name = res.data.data[i].name
          result[i].seats = res.data.data[i].seats
          result[i].proportionalSeats = res.data.data[i].seats
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
              result[i].color = '#78D7CE'
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

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none'
    },
    html: {
      [theme.breakpoints.up('xs')]: {
        fontSize: 10
      },
      [theme.breakpoints.up('sm')]: {
        fontSize: 12
      },
      [theme.breakpoints.up('md')]: {
        fontSize: 14
      },
      [theme.breakpoints.up('lg')]: {
        fontSize: 16
      },
      [theme.breakpoints.up('xl')]: {
        fontSize: 18
      }
    }
  },
  card: {
    height: 350
  },
  search: {
    marginBottom: '30px',
    backgroundColor: 'white'
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  content: {
    padding: theme.spacing(2, 0, 2)
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
    backgroundColor: '#00BCD4',
    color: 'white',
    height: '100px'
  },
  image: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(4)
  },
  seatPad: {
    paddingLeft: '150px'
  }
}))

export function getLink (str) {
  const nameArr = str.split(' ')
  return (
    'https://pm.gc.ca/en/cabinet/right-honourable-' +
    nameArr[0] +
    '-' +
    nameArr[nameArr.length - 1]
  )
}

export default function GeneralDashboard () {
  const classes = useStyles()
  const [ministerOpen, setMinisterOpen] = React.useState(false)
  const [currentMinistry, setCurrentMinistry] = React.useState('')
  const [filter, setFilter] = React.useState('')
  const [parties, setParties] = React.useState([])
  const [ministers, setMinisters] = React.useState([])
  const [filteredMinisters, setFilteredMinisters] = React.useState([])
  const [primeMinister, setPrimeMinister] = React.useState(null)

  const small = useMediaQuery(theme => theme.breakpoints.down('sm'))

  useEffect(() => {
    async function getData () {
      const mins = await getMinisters(setPrimeMinister)
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
      filteredMin = ministers.filter((minister) =>
        minister.title.toLowerCase().includes(filter.toLowerCase())
      )
    }
    setFilteredMinisters(filteredMin)
  }, [filter, ministers])

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
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
      {ministers && ministers.length > 0 && parties && parties.length > 0 ? (
        <div>
          <CssBaseline />
          <Container maxWidth='sm' component='main' className={classes.content}>
            <Typography
              component='h1'
              variant='h2'
              align='center'
              color='textPrimary'
              gutterBottom
            >
              My Government
            </Typography>
          </Container>
          <SeatingPlan partiesToUse={parties} classes={classes} />
          <Container
            align='center'
          >
            <Grid
              container
              className={classes.prime}
              alignItems='center'
              direction='row'
              justify='center'
            >
              <Grid
                item
                alignItems='center'
                direction='row'
                xs={12}
                sm={16}
                md={8}
              >
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
                        <Typography
                          component='li'
                          variant='subtitle1'
                          align='center'
                        >
                          <span style={{ fontWeight: 'bold' }}>Year Elected</span>{' '}
                          {primeMinister.fromDate}
                        </Typography>
                        <Typography
                          component='li'
                          variant='subtitle1'
                          align='center'
                        >
                          <span style={{ fontWeight: 'bold' }}>Riding</span>{' '}
                          {titleCase(primeMinister.riding)}
                        </Typography>
                        <Typography
                          component='li'
                          variant='subtitle1'
                          align='center'
                        >
                          <Link href={getLink(primeMinister.name)}>
                        More information
                          </Link>
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
              </Grid>
            </Grid>
          </Container>
          <Container>
            <TextField
              label='Filter by Ministry'
              className={classes.search}
              variant='outlined'
              onChange={handleFilterChange}
              color='primary'
            />
            <Grid
              container
              direction={small ? 'column' : 'row'}
              alignItems={small ? 'center' : 'flex-start'}
              spacing={5}
            >
              {filteredMinisters && filteredMinisters.length > 0 ? (
                filteredMinisters.map((minister) => (
                  <Grid item key={minister.title} xs={12} sm={16} md={4}>
                    <Card
                      className={classes.card}
                      min-width={small ? '50%' : '33%'}
                    >
                      <CardHeader
                        title={capitalize.words(minister.name)}
                        subheader={titleCase(minister.title)}
                        titleTypographyProps={{ align: 'center' }}
                        subheaderTypographyProps={{ align: 'center' }}
                        action={<HelpIcon style={{ cursor: 'pointer' }} onClick={() => handleMinisterClickOpen(titleCase(minister.title))} />}
                        className={classes.cardHeader}
                      />
                      <CardContent>
                        <div className={classes.image}>
                          <RepresentativeImage representative={minister.data} />
                        </div>
                        <ul>
                          <Typography
                            component='li'
                            variant='subtitle1'
                            align='center'
                          >
                            <span style={{ fontWeight: 'bold' }}>
                              Minister Since
                            </span>{' '}
                            {minister.description[0]}
                          </Typography>
                          <Typography
                            component='li'
                            variant='subtitle1'
                            align='center'
                          >
                            <span style={{ fontWeight: 'bold' }}>Riding</span>{' '}
                            {capitalize.words(minister.description[1])}
                          </Typography>
                          <Typography
                            component='li'
                            variant='subtitle1'
                            align='center'
                          >
                            <Link href={minister.description[2]}>
                              More information
                            </Link>
                          </Typography>
                        </ul>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={1}>
                  <Typography variant='h5' component='h2'>
                    No Results Found
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Container>
        </div>
      ) : (
        <div>
          <CenteredCircularProgress />
        </div>
      )}
      <MinisterHelpDialog
        ministry={currentMinistry}
        open={ministerOpen}
        onClose={handleMinisterClose}
        transition={Transition}
      />
    </Grid>
  )
}
