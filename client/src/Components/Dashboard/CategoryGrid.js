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

  useEffect(() => {
    async function getData () {

      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        const { email } = user
        const riding = await fetchUserRiding(email)
        const representative = await fetchRepresentative(riding)
        setUserRepresentative(representative)
      }
    }
    getData()
  }, [])

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
      .catch(err => console.error(err))
    return result
  }

  const deleteEvent = (index) => {
    const copyCategoryArray = Object.assign([], categoryList)
    copyCategoryArray.splice(index, 1)
    console.log(copyCategoryArray)
    setCategoryList(copyCategoryArray)
    updateUserCategory(copyCategoryArray).then(res=> {
      console.log("IM HERE INSIDE THE DELETE EVENT")
      setCounter(counter - 1)
    })
  }

  const addEvent = (newValue) => {
    const copyCategoryArray = Object.assign([], categoryList)
    copyCategoryArray.push(newValue)
    setCategoryList(copyCategoryArray)
    updateUserCategory(copyCategoryArray).then(res=>{
      console.log("IM HERE INSIDE THE ADDIING EVENT")
      setCounter(counter + 1)
    })
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

  useEffect(() => {
  }, [value, categoryList])

  return (
    <div className={classes.container}>
      <Grid container spacing={2}>
        {categoryList.map((category, index) => {
          return (
            <Grid item xs={4} key={index}>
              <CategoryCard
                id={index}
                title={category}
                delete={deleteEvent}
                representative={userRepresentative}
              />
            </Grid>
          )
        })}
        {counter < 3
          ? <Grid item md={4}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardContent>
                  <div onClick={handleClickListItem}>
                    <Typography gutterBottom variant='h5' component='h2' align='center' style={{ color: 'white' }}>
                                            Add New Category
                    </Typography>
                    <div align='center'>
                      <AddIcon color='white' fontSize='large' style={{ color: 'white', fontSize: 100 }} />
                    </div>
                  </div>
                  <ConfirmationDialogRaw
                    classes={{ paper: classes.paper }}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    value={value}
                    existedCategories={categoryList}
                  />
                </CardContent>
              </CardActionArea>
            </Card>
            </Grid>
          : <div />}
      </Grid>
    </div>
  )
}
export async function updateUserCategory (categoryList) {
  let result = ''
  const user = JSON.parse(localStorage.getItem('user'))
  const { email } = user
  console.log('email is '+ email)
  console.log('inside the updateUserCategory')
  await axios
      .post('http://localhost:5000/api/users/updateUserCategory', { email: email, categoryList: categoryList})
      .then(res => {
        result = res
        console.log('inside the axios call')
      })
      .catch(err => console.error(err))
  return result
}