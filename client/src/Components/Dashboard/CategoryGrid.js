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

function TabPanel (props) {
  const { children, value, index, ...other } = props
  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

export default function CategoryGrid () {
  const classes = useStyles()
  const [categoryList, setCategoryList] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [value] = React.useState('')
  const [counter, setCounter] = React.useState(0)
  const [userRepresentative, setUserRepresentative] = React.useState('')
  const [representativeData, setRepresentativeData] = React.useState([])
  const [reset, setReset] = React.useState(false)

  async function getUserInterests () {
    let result = []
    // eslint-disable-next-line no-undef
    const user = JSON.parse(localStorage.getItem('user'))
    await axios
      .post('http://localhost:5000/api/users/getUserInterests', { email: user.email })
      .then(res => {
        result = res.data.data.categories
      })
      .catch(err => console.error(err))
    return result
  }

  useEffect(() => {
    async function getAllBillsByRep (head) {
      let result = []
      await axios
        .get(`http://localhost:5000/api/bills/${head}/getAllBillsByRep`)
        .then(res => {
          if (res.data.success) {
            result = res.data.data
            setRepresentativeData(result)
          }
        })
        .catch(err => console.error(err))
      return result
    }

    async function getData () {
      // eslint-disable-next-line no-undef
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        const { email } = user
        const riding = await fetchUserRiding(email)
        const representative = await fetchRepresentative(riding)
        if (representative.length !== 0) {
          setUserRepresentative(representative)
        }

        await getUserInterests().then(res => {
          setCategoryList(res)
          setCounter(res.length)
        })
      }
    }

    getData()
    if (userRepresentative) {
      getAllBillsByRep(userRepresentative)
    }
  }, [userRepresentative, reset])

  async function fetchRepresentative (riding) {
    let result = ''
    await axios
      .get(
        `http://localhost:5000/api/representatives/${riding}/getRepresentative`
      )
      .then(res => {
        if (res.data.success) {
          result = res.data.data.name
        }
      })
      .catch(console.error)
    return result
  }

  const deleteEvent = (index) => {
    const copyCategoryArray = Object.assign([], categoryList)
    copyCategoryArray.splice(index, 1)
    setCategoryList(copyCategoryArray)
    updateUserCategory(copyCategoryArray)
    setCounter(counter - 1)
    setRepresentativeData([])
    setReset(!reset)
  }

  const addEvent = (newValue) => {
    const copyCategoryArray = Object.assign([], categoryList)
    copyCategoryArray.push(newValue)
    setCategoryList(copyCategoryArray)
    updateUserCategory(copyCategoryArray)
    setCounter(counter + 1)
  }

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
        {
          representativeData.length !== 0
            ? categoryList.map((category, index) => {
              return (
                <Grid item xs={4} key={index}>
                  <CategoryCard
                    id={index}
                    title={category}
                    delete={deleteEvent}
                    representative={representativeData}
                    data={(representativeData.length !== 0) ? representativeData : []}
                  />
                </Grid>
              )
            })
            : <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)' }}
            >
              <CircularProgress/>
            </div>
        }
        {(counter < 3 && representativeData.length > 0)
          ? <Grid item md={4}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardContent>
                  <div onClick={handleClickListItem}>
                    <Typography gutterBottom variant='h5' component='h2' align='center' style={{ color: 'white' }}>
                      Add New Category
                    </Typography>
                      <div align='center'>
                        <AddIcon color='white' fontSize='large' style={{ color: 'white', fontSize: 100 }}/>
                      </div>
                  </div>
                  <ConfirmationDialogRaw
                    classes={{ paper: classes.paper }}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    value={value}
                    existedCategories={categoryList}/>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          : <div/>}
      </Grid>
    </div>
  )
}

export async function updateUserCategory (categoryList) {
  let result = ''
  // eslint-disable-next-line no-undef
  const user = JSON.parse(localStorage.getItem('user'))
  const { email } = user
  await axios
    .post('http://localhost:5000/api/users/updateUserCategory', { email: email, categoryList: categoryList })
    .then(res => {
      result = res
    })
    .catch(console.error)
  return result
}
