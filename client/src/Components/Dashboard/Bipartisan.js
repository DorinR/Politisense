import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    IconButton,
    Divider,
    Typography, CardActions
} from '@material-ui/core';
import BarChartWrapper from "./Charts/Wrappers/BarChartWrapper";
import HelpOutlineRoundedIcon from '@material-ui/icons/HelpOutlineRounded';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BillDialog from "./BillDialog";
import D3ChartDescriptionDialog from "./D3ChartDescriptionDialog";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Collapse from '@material-ui/core/Collapse';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%'
    },
    chartContainer: {
        position: 'relative',
        height: '100%',
    },
    stats: {
        marginTop: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center'
    },

    title: {
        color: "#263238",
        fontSize: "16px",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontWeight: 700
    },
    actions: {
        display: 'relative',
        justifyContent: 'flex-end'
    },
}));
const Bipartisan = props => {
    const { className, ...rest } = props;
    const classes = useStyles();
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
        if(row && type == 'donut'){
            let temp = {
                name: row.billDetails.billData.number,
                desc:row.billDetails.billData.title,
                link:row.billDetails.billData.link,
                sponsor:row.billDetails.billData.sponsorName,
                date:row.billDetails.billData.dateVoted
            }
            setBillInfo(temp)
            setBillOpen(true)
        }
    }
    const handleBillClose = () => {
        setBillOpen(false)
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
                    <IconButton aria-label="settings">
                        <HelpOutlineRoundedIcon onClick={handleClickOpen}/>
                    </IconButton>
                }
                title="BiPartisan Index"
            />
            <Divider />
            <CardContent>
                <div className={classes.chartContainer}>
                    <BarChartWrapper
                        type= {props.title}
                        data={props.data}
                    />
                </div>
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
                                    <TableCell>Category</TableCell>
                                    <TableCell>Vote</TableCell>
                                    <TableCell>Political Party</TableCell>
                                </TableRow>
                            </TableHead>
                            {(props.rows.length) > 0 ? (
                                <TableBody stickyHeader>
                                    {props.rows.map((row,i)=> (
                                        <TableRow key={i}>

                                            <TableCell component='th' scope='row'>
                                                <Button color='primary' onClick={() => handleBillClickOpen(row,'donut')}>
                                                    <Typography>{row.billDetails.billData.number}</Typography>
                                                </Button>
                                            </TableCell>

                                            <TableCell component='th' scope='row'>
                                                <Typography>{row.billDetails.billData.category}</Typography>
                                            </TableCell>

                                            <TableCell component='th' scope={'row'}>
                                                <Typography style= {{color:"green"}}>{row.billDetails.voteRecord.yea == true ? "Yea":"Nay"}</Typography>
                                            </TableCell>

                                            <TableCell component='th' scope={'row'}>
                                                <Typography>{row.category}</Typography>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>) : 'nothing'}
                        </Table>
                    </TableContainer>
                </CardContent>
            </Collapse>
            <BillDialog billInfo={billInfo} open={billOpen} onClose={handleBillClose} />
            <D3ChartDescriptionDialog open = {open} onClose={handleClose}/>
        </Card>
    );
};

Bipartisan.propTypes = {
    className: PropTypes.string
};

export default Bipartisan;