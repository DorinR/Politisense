import React, {useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DescriptionIcon from '@material-ui/icons/Description'
import List from '@material-ui/core/List'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import HelpIcon from '@material-ui/icons/Help'
import LinkIcon from '@material-ui/icons/Link'
import PersonIcon from '@material-ui/icons/Person'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import Link from '@material-ui/core/Link'
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import BillDialog from "./BillDialog";
import Grid from "@material-ui/core/Grid";
import CategoryCard from "./CategoryCard";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: '#43D0C4'
    },
    table: {
        minWidth: 650,
    },
    heroContent: {
        padding: theme.spacing(8, 0, 8),

    }
}))
export function capitalizedName (sponsor) {
    if (sponsor && isNaN(sponsor)) {
        let name = sponsor
        name = name.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ')
        return name
    }
    return null
}
export default function DialogRadarChart (props) {
    const classes = useStyles()
    const { onClose, selectedValue, open, } = props
    const [uniqueCategories, setUniqueCategories]=React.useState([...new Set(props.representativeData.map(item => item.billData.category))])
    const handleClose = () => {
        onClose(selectedValue)
    }

    useEffect(()=>{
        if(props.representativeData){
            let uniqueArr=  [...new Set(props.representativeData.map(item => item.billData.category))]
            console.log(uniqueArr)
            setUniqueCategories(uniqueArr)
        }
    },[props.representativeData])
    console.log(uniqueCategories,props.representativeData)
    return (
        <Dialog onClose={handleClose} open={open} maxWidth={"lg"}>
            <Container maxWidth="lg" component="main" className={classes.heroContent}>
                <Typography component="h5" variant="h4" align="center" color="textPrimary" gutterBottom>
                    The MP's Activity Based on Voting History For Each Category
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" component="p">
                    This section shows MP's Voting History
                </Typography>
            </Container>
            <Divider />
            <Grid container spacing={4}>
                {   props.representativeData.length !== 0
                    ? uniqueCategories.map((category, index) => {
                        return (
                            <Grid item xs={4} key={index}>
                                <CategoryCard
                                    radar ={'radar'}
                                    id={index}
                                    title={category}
                                    representative={props.representativeData}
                                    data={(props.representativeData.length !== 0) ? props.representativeData : []}
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
            </Grid>
        </Dialog>
    )
}