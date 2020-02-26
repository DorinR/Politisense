import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import BarChartWrapper from "./Charts/Wrappers/BarChartWrapper";
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Button
} from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import CardActionArea from '@material-ui/core/CardActionArea';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import BillDialog from "./BillDialog";
import TableDialog from "./TableDialog";
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import D3ChartDescriptionDialog from "./D3ChartDescriptionDialog";
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
    root: {},
    chartContainer: {
        height: 400,
        position: 'relative'
    },
    actions: {
        justifyContent: 'flex-end'
    },
    title: {
        color: "#263238",
        fontSize: "16px",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontWeight: 700
    }
}));

const IssuedBillsByMP = props => {
    const classes = useStyles();
    const { className, ...rest } = props;
    const [tableContents, setTableContents] = React.useState([])
    const [tableDialogOpen, setTableDialogOpen] = React.useState(false)
    const [expanded, setExpanded] = React.useState(false);
    const [billInfo, setBillInfo] = React.useState([])
    const [billOpen, setBillOpen] = React.useState(false)
    const [open, setOpen] = React.useState(false)

   const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const handleBillClickOpen = (row,type) => {
        if(row && type =='bar-pie'){
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
        if(row && type =='radar'){
            let temp = {
                name: row.billData.number,
                desc:row.billData.title,
                link:row.billData.link,
                sponsor:row.billData.sponsorName,
                date:row.billData.dateVoted
            }
            setBillInfo(temp)
            setBillOpen(true)
        }
    }
    const handleBillClose = () => {
        setBillOpen(false)
    }
    // click on the chart of pie part chart
    const handleBarPieChartClickOpen = (rows) => {
        setTableContents(rows)
        setTableDialogOpen(true)
    }
    const handleBarPieChartClose = () => {
        setTableDialogOpen(false)
    }

    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}
        >
            <CardHeader
                classes={{
                title: classes.title,
            }}
                action={
                    //onClick={this.handleClickOpen}
                    <IconButton aria-label="settings">
                        <HelpOutlineOutlinedIcon onClick={handleClickOpen}/>
                    </IconButton>
                }
                title="MP's Activity and Bills Proposed"
            />
            <Divider />
            <CardContent>
                <CardActionArea>
                    <div onClick={() => handleBarPieChartClickOpen(props.rows)}>
                <div className={classes.chartContainer}>
                    <BarChartWrapper
                        type="bar-pie"
                        data={props.userRepIssuedBills}
                        categories={props.categoryList}
                    />
                </div>
                    </div>
                </CardActionArea>
            </CardContent>
            <Divider />
            <CardActions className={classes.actions}>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>The issued bills are: </Typography>
                    <TableContainer className={classes.tableContainer}>
                        <Table className={classes.table} size='medium' aria-label='a dense table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Bill Name</TableCell>
                                    <TableCell> Category </TableCell>
                                    <TableCell align='right'>Bill Status</TableCell>
                                </TableRow>
                            </TableHead>
                            {(props.rows.length) > 0 ? (
                                <TableBody stickyHeader>
                                    {props.rows.map((row,i)=> (
                                        <TableRow key={i}>
                                            <TableCell component='th' scope='row'>
                                                <Button color='primary' onClick={() => handleBillClickOpen(row,'bar-pie')}>
                                                    <Typography>{row.bill.billsClassified.number}</Typography>
                                                </Button>
                                            </TableCell>
                                            <TableCell component='th' scope='row'><Typography>{row.category}</Typography></TableCell>
                                            <TableCell align='right'><Typography style= {row.status === 'Passed'? {color:"green"}: {color: "red"}}>{row.status}</Typography></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>) : 'nothing'}
                        </Table>
                    </TableContainer>
                </CardContent>
            </Collapse>
            <BillDialog billInfo={billInfo} open={billOpen} onClose={handleBillClose} />
            <TableDialog rows={tableContents} open={tableDialogOpen} onClose={handleBarPieChartClose}> </TableDialog>
            <D3ChartDescriptionDialog open = {open} onClose={handleClose}/>
        </Card>

    );
};

IssuedBillsByMP.propTypes = {
    className: PropTypes.string
};

export default IssuedBillsByMP;