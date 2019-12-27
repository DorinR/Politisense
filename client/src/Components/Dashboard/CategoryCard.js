import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import PieChartIcon from '@material-ui/icons/PieChart';
import { loadCSS } from 'fg-loadcss';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import GavelIcon from '@material-ui/icons/Gavel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBalanceScale, faHandshake, faPrayingHands } from '@fortawesome/free-solid-svg-icons';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import {ConfirmationDialogRaw} from "./CategoryForm";
import Grid from "@material-ui/core/Grid";
import ChartCard from "./ChartCard";
import RadarChart from "./Charts/RadarChart";

const useStyles = makeStyles(theme => ({
    card: {
        // maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    table: {
        // minWidth: 650,
    }
}));

function createData(name, vote) {
    return { name, vote };
}

export default function CategoryCard(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [id,setId]= React.useState(0)
    const [title,setTitle]= React.useState('')
    const [openDeleteDialog,setOpenDeleteDialog] = React.useState(false)
    const [confimedDeletion, setConfimedDeletion] = React.useState(false)


    const handleDeleteDialogClose= (newValue,index) =>{
        console.log('the newValue of the card is '+newValue)
        console.log('the index of the card is '+index)

        if(newValue == true){
            props.delete(index)
        }
        setOpenDeleteDialog(false)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleDelete =()=>{
        setOpenDeleteDialog(true)
    }
    function setCardLogo(){
        switch(title) {
            case 'Economics':
                return <TrendingUpIcon color="primary" />
            case 'Criminal':
                return <GavelIcon color="primary" />
            case 'Religion':
                return <FontAwesomeIcon icon={faPrayingHands} color="#43D0C4" size="lg" />
            case 'Human Rights':
                return <FontAwesomeIcon icon={faBalanceScale} color="#43D0C4" size="lg" />
            default:
                return <IndeterminateCheckBoxIcon color="primary" />;
        }
    }

    React.useEffect(() => {
        // setId(props.id)
        // setTitle(props.title)
        loadCSS(
            'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
            document.querySelector('#font-awesome-css'),
        )
    }, []);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const rows = [
        createData('Bill 101', 'Yes'),
        createData('Bill 102', 'No'),
        createData('Bill 103', 'Abstain'),
    ];

    return (
        <div>
                <Card className={classes.card}>
                    <CardHeader
                        avatar={setCardLogo()}
                        action={
                            <div>
                            <IconButton aria-label="settings" onClick={()=>setOpenDeleteDialog(true)}>
                                <IndeterminateCheckBoxIcon color='primary'/>
                            </IconButton>
                            </div>
                        }
                        title={props.title}
                    />
                    <DeleteCategoryDialog
                        classes={{
                            paper: classes.paper,}}
                        keepMounted
                        open={openDeleteDialog}
                        index = {props.id}
                        onClose={handleDeleteDialogClose}
                        value = {confimedDeletion}
                    />
                    <CardContent>
                         <ChartCard title='MP Voting Distribution'> <RadarChart /> </ChartCard>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Bill Name</TableCell>
                                    <TableCell align="right">Vote</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.vote}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton>
                            <CompareArrowsIcon color="primary"/>
                        </IconButton>
                        <IconButton>
                            <PieChartIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={handleClickOpen}>
                            <FontAwesomeIcon icon={faHandshake} color="#43D0C4" />
                        </IconButton>
                    </CardActions>
                </Card>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Let Google help apps determine location. This means sending anonymous location data to
                        Google, even when no apps are running.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Disagree
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
