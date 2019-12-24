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
    const [counter, setCounter]= React.useState(0)


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
         setCounter(counter-1)

         console.log(categoryList)
    }

    const addEvent = (newValue) => {
        const copyCategoryArray = Object.assign([],categoryList)
        copyCategoryArray.push(newValue)
        setCategoryList(copyCategoryArray)
        setCounter(counter+1)
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
    {/*<Grid container spacing={2}>*/}
    {/*  <Grid item xs={8}>*/}
    {/*    <Card className={classes.card}>*/}
    {/*      <CardHeader />*/}
    {/*      <BarChartWrapper type='bar-pie' />*/}
    {/*      <CardContent>*/}
    {/*        <Typography variant='body2' color='textSecondary' component='p'>*/}
    {/*                          Voting record of your MP.*/}
    {/*        </Typography>*/}
    {/*      </CardContent>*/}
    {/*      <CardActions disableSpacing>*/}
    {/*        <IconButton*/}
    {/*          className={clsx(classes.expand, {*/}
    {/*            [classes.expandOpen]: expanded*/}
    {/*          })}*/}
    {/*          onClick={handleExpandClick}*/}
    {/*          aria-expanded={expanded}*/}
    {/*          aria-label='show more'*/}
    {/*        >*/}
    {/*          <ExpandMoreIcon />*/}
    {/*        </IconButton>*/}
    {/*      </CardActions>*/}
    {/*      <Collapse in={expanded} timeout='auto' unmountOnExit>*/}
    {/*        <CardContent>*/}

    {/*          <Tabs*/}
    {/*            value={tabValue}*/}
    {/*            onChange={handleChange}*/}
    {/*            indicatorColor='primary'*/}
    {/*            textColor='primary'*/}
    {/*            variant='fullWidth'*/}
    {/*            aria-label='full width tabs example'*/}
    {/*          >*/}
    {/*            <Tab label='Healthcare' {...a11yProps(0)} />*/}
    {/*            <Tab label='Economics' {...a11yProps(1)} />*/}
    {/*          </Tabs>*/}
    {/*          <SwipeableViews*/}
    {/*            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}*/}
    {/*            index={tabValue}*/}
    {/*            onChangeIndex={handleChangeIndex}*/}
    {/*          >*/}
    {/*            <TabPanel value={tabValue} index={0} dir={theme.direction}>*/}
    {/*              <CategoryTable />*/}
    {/*            </TabPanel>*/}
    {/*            <TabPanel value={tabValue} index={1} dir={theme.direction}>*/}
    {/*              <CategoryTable />*/}
    {/*            </TabPanel>*/}
    {/*          </SwipeableViews>*/}
    {/*        </CardContent>*/}
    {/*      </Collapse>*/}
    {/*    </Card>*/}
    {/*  </Grid>*/}
    {/*  <Grid item xs={1}>*/}
    {/*    <Grid container spacing={2}>*/}
    {/*      <Grid item={12}>*/}
    {/*        <ChartCard title='MP Voting Distribution'> <RadarChart /> </ChartCard>*/}
    {/*      </Grid>*/}
    {/*      <Grid item={12}>*/}
    {/*        <ChartCard title='Bipartisan Index'> <BarChartWrapper /> </ChartCard>*/}
    {/*      </Grid>*/}
    {/*    </Grid>*/}
    {/*  </Grid>*/}
    {/*</Grid>*/}
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
                {counter < 3 ? <Grid item md={3}>
                    <Card className={classes.card}>
                    <CardActionArea>
                    <CardContent>
                    <div onClick={handleClickListItem}>
                    <Typography gutterBottom variant="h5" component="h2" align="center" style={{ color: 'white' }}>
                    Add New Category
                    </Typography>
                    <div align='center'>
                    <AddIcon color='white' fontSize="large" style={{ color: 'white', fontSize: 100 }}/>
                    </div>
                    </div>
                    <div className={classes.root}>
                    {/*<Tooltip title="Add" aria-label="add" >*/}
                    {/*</Tooltip>*/}
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
                    : <div/>
                }
            </Grid>
        </div>
    )
}
