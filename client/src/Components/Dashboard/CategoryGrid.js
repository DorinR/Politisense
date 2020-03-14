import React, { useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { red } from '@material-ui/core/colors'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import CategoryCard from './CategoryCard'
import CardActionArea from '@material-ui/core/CardActionArea'
import { ConfirmationDialogRaw } from './CategoryForm'
import AddIcon from '@material-ui/icons/Add'
import axios from 'axios'
import { fetchUserRiding } from '../Navbar'
import CircularProgress from '@material-ui/core/CircularProgress'
/* eslint-disable */

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: '#43D0C4'
  },
  container: {
    margin: '20px',
    marginTop: '30px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  },
  fab: {
    marginLeft: theme.spacing(18),
    margin: theme.spacing(2)
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3)
  }
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

export default function CategoryGrid() {
  const classes = useStyles()

  const [user, setUser] = React.useState(null)
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const user = JSON.parse(localStorage.getItem('user'))
    setUser(user)
  }, [])

  const [categoryList, setCategoryList] = React.useState(null)
  useEffect(() => {
    async function getData() {
      if (user) {
        const interests = await getUserInterests(user.email)
        setCategoryList(interests)
      }
    }
    getData()
  }, [user])

  async function getUserInterests(email) {
    return axios
      .post('/api/users/getUserInterests', { email: email })
      .then(res => {
        return res.data.data.categories
      })
      .catch(console.error)
  }

  const [counter, setCounter] = React.useState(null)
  useEffect(() => {
    if (categoryList) {
      setCounter(categoryList.length)
    }
  }, [categoryList])

  const [riding, setRiding] = React.useState(null)
  useEffect(() => {
    async function getData() {
      if (user) {
        const riding = await fetchUserRiding(user.email)
        setRiding(riding)
      }
    }
    getData()
  }, [user])

  const [userRepresentative, setUserRepresentative] = React.useState(null)
  useEffect(() => {
    async function getData() {
      if (riding) {
        const representative = await fetchRepresentative(riding)
        setUserRepresentative(representative)
      }
    }
    getData()
  }, [riding])

  async function fetchRepresentative(riding) {
    return axios
      .get(`/api/representatives/${riding}/getRepresentative`)
      .then(res => {
        if (res.data.success) {
          return res.data.data.name
        }
      })
      .catch(console.error)
  }

  const [representativeData, setRepresentativeData] = React.useState(null)
  useEffect(() => {
    async function getData() {
      if (userRepresentative) {
        const representative = await getAllBillsByRep(userRepresentative)
        setRepresentativeData(representative)
      }
    }
    getData()
  }, [userRepresentative])

  async function getAllBillsByRep(head) {
    return axios
      .get(`/api/bills/${head}/getAllBillsByRepForAllParliaments`)
      .then(res => {
        if (res.data.success) {
          return res.data.data
        }
      })
      .catch(console.error)
  }

  const [value] = React.useState('')
  const deleteEvent = index => {
    const copyCategoryArray = Object.assign([], categoryList)
    copyCategoryArray.splice(index, 1)
    updateUserCategory(copyCategoryArray)
      .then(res => {
        if (res.data.success) {
          setCategoryList(copyCategoryArray)
          setCounter(counter - 1)
        }
      })
      .catch(console.error)
  }

  const addEvent = newValue => {
    const copyCategoryArray = Object.assign([], categoryList)
    copyCategoryArray.push(newValue)
    updateUserCategory(copyCategoryArray)
      .then(res => {
        if (res.data.success) {
          setCategoryList(copyCategoryArray)
          setCounter(counter + 1)
        }
      })
      .catch(console.error)
  }

  async function updateUserCategory(categoryList) {
    return axios
      .post('/api/users/updateUserCategory', {
        email: user.email,
        categoryList: categoryList
      })
      .catch(console.error)
  }

  const [open, setOpen] = React.useState(false)
  const handleClickListItem = () => {
    setOpen(true)
  }

  const handleClose = newValue => {
    if (newValue) {
      addEvent(newValue)
    }
    setOpen(false)
  }
  /* eslint-disable */
  return (
    <div className={classes.container}>
      <Grid container spacing={2}>
        {representativeData && categoryList ? (
          categoryList.map((category, index) => {
            return (
              <Grid item xs={4} key={categoryList[index]}>
                <CategoryCard
                  id={index}
                  title={category}
                  delete={deleteEvent}
                  representative={representativeData}
                  data={representativeData}
                />
              </Grid>
            )
          })
        ) : (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
            <CircularProgress />
          </div>
        )}
        {(counter === 0 || counter < 3) &&
        representativeData &&
        categoryList ? (
          <Grid item md={4}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardContent>
                  <div onClick={handleClickListItem}>
                    <Typography
                      gutterBottom
                      variant='h5'
                      component='h2'
                      align='center'
                      style={{ color: 'white' }}>
                      Add New Category
                    </Typography>
                    <div align='center'>
                      <AddIcon
                        color='white'
                        fontSize='large'
                        style={{ color: 'white', fontSize: 100 }}
                      />
                    </div>
                  </div>
                  <ConfirmationDialogRaw
                    classes={{ paper: classes.paper }}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    value={value}
                    existedcategories={categoryList}
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ) : (
          <div />
        )}
      </Grid>
    </div>
  )
}
