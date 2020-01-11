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
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import axios from "axios";
import {fetchUserRiding} from "../Navbar";

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

export default function CategoryGrid (props) {
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
    const [openDeleteDialog, setOpenDeleteDialog] =React.useState(false)
    const [userRepresentative, setUserRepresentative] = React.useState('')

    useEffect(() => {
        async function getData () {
            /* eslint-disable */
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
                    const representative = res.data.data.name
                    result = representative
                }
            })
            .catch(err => console.error(err))
        return result
    }

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
        console.log(copyCategoryArray)
        setCategoryList(copyCategoryArray)
        setCounter(counter-1)
    }

    const addEvent = (newValue) => {
        const copyCategoryArray = Object.assign([],categoryList)
        copyCategoryArray.push(newValue)
        setCategoryList(copyCategoryArray)
        setCounter(counter+1)
    }

    const handleClickListItem = () => {
        setOpen(true);
    }

    const handleClose = newValue => {
        if(newValue){
            addEvent(newValue)
        }
        setOpen(false)
    }

    useEffect(()=>{
    },[value,categoryList])

    return (
        <div className={classes.container}>
            <Grid container spacing={2}>
                {categoryList.map((category, index)=>{
                    return (
                        <Grid item xs={4} key={index}>
                            <CategoryCard
                                id={index}
                                title={category}
                                delete ={deleteEvent}
                                representative={userRepresentative}
                            />
                        </Grid>
                    )})}
                {counter < 3 ?
                    <Grid item md={4}>
                        <Card className={classes.card}>
                            <CardActionArea>
                                <CardContent>
                                    <div onClick={handleClickListItem}>
                                        <Typography gutterBottom variant="h5" component="h2" align="center" style={{ color: 'white' }}>
                                            Add New Category </Typography>
                                        <div align='center'>
                                            <AddIcon color='white' fontSize="large" style={{ color: 'white', fontSize: 100 }}/>
                                        </div>
                                    </div>
                                    <ConfirmationDialogRaw
                                        classes={{
                                            paper: classes.paper,}}
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
                    : <div/>}
            </Grid>
        </div>
    )
}