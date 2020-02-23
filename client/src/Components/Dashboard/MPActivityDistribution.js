import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Divider,
    IconButton, Typography
} from '@material-ui/core';
import Radar from 'react-d3-radar'
import HelpOutlineRoundedIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Collapse from "@material-ui/core/Collapse";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import BillDialog from "./BillDialog";
import D3ChartDescriptionDialog from "./D3ChartDescriptionDialog";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DialogRadarChart from "./DialogRadarChart";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
const useStyles = makeStyles((theme) => ({
    root: {
        height: '`calc(100% - 1px)%',
        // width: `calc(100% - 20px)`,
// [theme.breakpoints.up('lg')]: {
        //     height: "90%"}
    },
    content: {
        padding: 0
    },
    image: {
        height: 48,
        width: 48
    },
    title: {
        color: "#263238",
        fontSize: "16px",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontWeight: 480
    },
    actions: {
        justifyContent: 'flex-end',
    }
}));

const MPActivityDistribution = props => {
    const { className, ...rest } = props;
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [billInfo, setBillInfo] = React.useState([])
    const [billOpen, setBillOpen] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [tableDialogOpen, setTableDialogOpen] = React.useState(false)

    const handleRadarTableDialogClose = () => {
        setTableDialogOpen(false)
    }
    const handleD3ClickOpen = (rows) => {
        setTableDialogOpen(true)
    }
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
                        <HelpOutlineIcon onClick={handleClickOpen}/>
                    </IconButton>
                }
                title="MP's Activity Distribution"
            />
            <Divider />
            <CardContent>
                <div className={classes.chartContainer} onClick={() => handleD3ClickOpen(props.rows)}>
                    <Radar
                        width={400}
                        height={385}
                        padding={30}
                        domainMax={props.radarData[1]}
                        highlighted
                        onHover={point => {
                            if (point) {
                            } else {
                            }
                        }}
                        data={{
                            variables: [
                                { key: 'trade', label: 'Trade' },
                                { key: 'criminal', label: 'Criminal' },
                                { key: 'business', label: 'Business' },
                                { key: 'economics', label: 'Economics' },
                                { key: 'healthcare', label: 'Healthcare' },
                                { key: 'religion', label: 'Religion' },
                                { key: 'human rights', label: 'Human Rights' }
                            ],
                            sets: [
                                {
                                    values: props.radarData[0]
                                }
                            ]
                        }}
                        size={400}
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
                                    <TableCell>{"Bill Name"}</TableCell>
                                    <TableCell>{"Category"}</TableCell>
                                    <TableCell align='right'>{"Vote"}</TableCell>
                                </TableRow>
                            </TableHead>
                            {(props.rows.length) > 0 ? (
                                <TableBody stickyHeader>
                                    {props.rows.map((row,i)=> (
                                        <TableRow key={i}>
                                            <TableCell component='th' scope='row'>
                                                <Button color='primary' onClick={() => handleBillClickOpen(row,'radar')}>
                                                    <Typography>{row.voteRecord.billNumber}</Typography>
                                                </Button>
                                            </TableCell>
                                            <TableCell component='th' scope='row'><Typography>{row.billData.category}</Typography></TableCell>
                                            <TableCell align='right'>
                                                <Typography style= {row.voteRecord.yea === true? {color:"green"}: {color: "red"}}>
                                                    {row.voteRecord.yea == true? "Yea": "Nay"}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>) : 'nothing'}
                        </Table>
                    </TableContainer>
                </CardContent>
            </Collapse>
            <DialogRadarChart representativeData={props.rows} categoryList= {props.categoryList} open={tableDialogOpen} onClose={handleRadarTableDialogClose}> </DialogRadarChart>
            <BillDialog billInfo={billInfo} open={billOpen} onClose={handleBillClose} />
            <D3ChartDescriptionDialog open = {open} onClose={handleClose}/>
        </Card>
    );
};

MPActivityDistribution.propTypes = {
    className: PropTypes.string
};

export default MPActivityDistribution;


