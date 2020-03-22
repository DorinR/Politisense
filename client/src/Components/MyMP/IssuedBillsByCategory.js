import React, {useEffect} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Timeline, TimelineItem }  from 'vertical-timeline-component-for-react';
import {Card, Grid,CardContent,Divider} from "@material-ui/core";
import clsx from "clsx";
import BarChartWrapper from "../Dashboard/Charts/Wrappers/BarChartWrapper"
import TableDialog from "./TableDialog";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import BillDialog from "../Dashboard/BillDialog";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import {capitalizedName, formattingCategory} from "../Dashboard/Utilities/CommonUsedFunctions";

const useStyles = makeStyles(theme => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none'
        }
    },
    card: {
        height: 350
        // height: "100%"
    },
    search: {
        marginBottom: '30px',
        backgroundColor: 'white'
    },
    link: {
        margin: theme.spacing(1, 1.5)
    },
    content: {
        padding: theme.spacing(8, 0, 5)
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
        backgroundColor: '#43D0C4',
        color: 'white',
        height: '100px'
    },
    image: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),
        marginRight: theme.spacing(4)

    }
}))

const IssuedBillsByCategory = (props)=> {
    console.log(props)
    const classes = useStyles()
    const { onClose, selectedValue, open } = props
    const [billInfo, setBillInfo] = React.useState([])
    const [billOpen, setBillOpen] = React.useState(false)
    const handleBillClose = () => {
        setBillOpen(false)
    }
    const handleCloseDialog = () => {
        onClose(selectedValue)
    };
    const handleBillClickOpen = (row) => {
        if(row){
            let temp = {
                name: row.bill.billsClassified.number,
                desc:row.bill.billsClassified.title,
                link:row.bill.billsClassified.link,
                sponsor:row.bill.billsClassified.sponsorName,
                date:row.bill.billsClassified.dateVoted
            }
            setBillInfo(temp)
            setBillOpen(true)
        }
    }
    const handleFilterChange = e => {
        setFilter(e.target.value)
    }
    const [filter, setFilter] = React.useState('')
    const [filteredRowsByCategory, setFilteredRowsByCategory] = React.useState([])
    const [rows,setRows] = React.useState( [])

    useEffect(()=>{
        if(props.location.aboutProps){
            setRows(props.location.aboutProps.rows)
        }
    },[])


    useEffect(()=>{
        if(rows){
            let filteredRowsByCategory
            if (filter === ''  || rows.findIndex(ele => ele.category == filter) == -1 || filter == undefined ) {
                filteredRowsByCategory = rows
            } else {
                filteredRowsByCategory = rows.filter(row => row.category.toLowerCase().includes(filter.toLowerCase()))
            }
            setFilteredRowsByCategory(filteredRowsByCategory)
        }
    },[filter,rows])

    return (
        <div>
        {props.location.aboutProps?
                <Container maxWidth='md' component='main' className={classes.content}>
                    <Grid container>
                        <Grid item xs={12} lg={12} sm={12} md={12} >
                            <Card style={{height:"100%", width: "100%", display:"flex"}}>
                                <CardContent >
                                    <BarChartWrapper
                                        type="bar-pie"
                                        data={props.location.aboutProps.userRepIssuedBills}
                                        categories={props.location.aboutProps.categoryList}
                                    />
                                    <Divider/>
                                    <br/>
                                    {filteredRowsByCategory && filteredRowsByCategory.length > 0 ?
                                        <TableContainer >
                                            <TextField label='Filter by Category'  variant='outlined' onChange={handleFilterChange} color='primary' />
                                            <Table size='medium'  aria-label='simple table'>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Bill Name</TableCell>
                                                        <TableCell align='center'> Category </TableCell>
                                                        <TableCell align='right'>Bill Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody stickyHeader>
                                                    {filteredRowsByCategory.map((row,i)=> (
                                                        row.bill ?
                                                            (
                                                                <TableRow key={i}>
                                                                    <TableCell component='th' scope='row'>
                                                                        <Button color='primary' onClick={() => handleBillClickOpen(row)}>
                                                                            <Typography>{row.bill.billsClassified.number}</Typography>
                                                                        </Button>
                                                                    </TableCell>
                                                                    <TableCell component='th' scope='row' align='center'>
                                                                        <Typography>{row.category.map(category => " "+capitalizedName(formattingCategory(category)))}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align='right'><Typography>{row.status} </Typography> </TableCell>
                                                                </TableRow>
                                                            ):("")
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        : ""}
                                    <BillDialog billInfo={billInfo} open={billOpen} onClose={handleBillClose} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
        :""}
        </div>
    );
}

export default IssuedBillsByCategory
