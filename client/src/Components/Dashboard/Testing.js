import React, {useEffect} from 'react'
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import BarChartWrapper from './Charts/Wrappers/BarChartWrapper'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import { red } from '@material-ui/core/colors'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CategoryTable from './CategoryTable'
import ChartCard from './ChartCard'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'
import Box from '@material-ui/core/Box'
import RadarChart from './Charts/RadarChart'
import CategoryCard from "./CategoryCard";
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {ConfirmationDialogRaw} from "./CategoryForm";
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
    card: {
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
        margin: theme.spacing(2),
    },
    absolute: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
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
// when i remove a category i need to delete from my categories as well as adding that attribute in the options
export default function Testing (props) {
    const classes = useStyles()
    const theme = useTheme()
    const [categoryList, setCategoryList]= React.useState([])
    const [expanded, setExpanded] = React.useState(false)
    const [tabValue, setTabValue] = React.useState(0)
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState('')
    const [checked, setChecked] = React.useState(true)
    const [newCategory, setNewCategory]= React.useState('')

    //  const addNewCategory = () => {
    //      if(newCategory != ''){
    //          categoryList.concat(newCategory)
    //          console.log(categoryList)
    //      }
    // }

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    const handleChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const handleChangeIndex = index => {
        setTabValue(index)
    }
     const deleteEvent = (index) => {
        const copyCategoryArray = Object.assign([],categoryList)
         copyCategoryArray.splice(index,1)
         setCategoryList(copyCategoryArray)
         console.log(categoryList)
    }

    const addEvent = (newValue) => {
        const copyCategoryArray = Object.assign([],categoryList)
        copyCategoryArray.push(newValue)
        setCategoryList(copyCategoryArray)
        console.log(copyCategoryArray)
    }

    const handleClickListItem = () => {
        setOpen(true);
    };

    const handleClose = newValue => {
        if(newValue){
            addEvent(newValue)
        }
        setOpen(false);
    }

    useEffect(()=>{

    },[value])

    return (
        <div className={classes.container}>
            <Grid container spacing={2}>
                {categoryList.map((category, index)=>{
                  return (
                      <Grid item xs={3} key={index}>
                            <CategoryCard
                            key={index}
                            id={index}
                            title={category}
                            delete ={deleteEvent.bind(this,index)}
                            />
                          </Grid>
                          )
                })}
                <Grid item md={3}>
                    <Card className={classes.card}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Add New Category
                                    </Typography>
                                    <div className={classes.root}>
                                          <Tooltip title="Add" aria-label="add" onClick={handleClickListItem} >
                                              <Fab color="primary" className={classes.fab}>
                                                 <AddIcon />
                                              </Fab>
                                          </Tooltip>
                                            <ConfirmationDialogRaw
                                                classes={{
                                                    paper: classes.paper,
                                                }}
                                                keepMounted
                                                open={open}
                                                onClose={handleClose}
                                                value={value}
                                                existedCategories={categoryList}
                                            />
                                    </div>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                </Grid>
            </Grid>

        </div>
    )
}
