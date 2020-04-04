import React, { useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { red } from '@material-ui/core/colors'
import CategoryCard from './CategoryCard'
import CardActionArea from '@material-ui/core/CardActionArea'
import { ConfirmationDialogRaw } from './CategoryForm'
import AddIcon from '@material-ui/icons/Add'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: '#00bcd4'
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

export default function CategoryGrid (props) {
  const classes = useStyles()
  const [categoryList, setCategoryList] = React.useState(null)
  useEffect(() => {
    async function getData () {
      if (props.user) {
        const interests = await getUserInterests(props.user.email)
        setCategoryList(interests)
      }
    }
    getData()
  }, [props.user])

  async function getUserInterests (email) {
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

  const [value] = React.useState(false)
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
    if (newValue.includes(' ')) {
      newValue = newValue.replace(' ', '-')
    }
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

  async function updateUserCategory (categoryList) {
    return axios
      .post('/api/users/updateUserCategory', {
        email: props.user.email,
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
        {props.representativedata && categoryList ? (
          categoryList.map((category, index) => {
            return (
              <Grid item xs={4} key={categoryList[index]}>
                <CategoryCard
                  id={index}
                  title={category}
                  delete={deleteEvent}
                  representative={props.representativedata}
                  data={props.representativedata}
                />
              </Grid>
            );
          })
        ) : (
          <div
            style={{
              position: "relative",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <CircularProgress style={{ color: "#00bcd4" }} />
          </div>
        )}
        {(counter === 0 || counter < 3) &&
        props.representativedata &&
        categoryList ? (
          <Grid item md={4}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardContent>
                  <div onClick={handleClickListItem}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      align="center"
                      style={{ color: "white" }}
                    >
                      Add New Category
                    </Typography>
                    <div align="center">
                      <AddIcon
                        fontSize="large"
                        style={{ color: "white", fontSize: 100 }}
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
                    allcategories ={props.categorylist}
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
  );
}
