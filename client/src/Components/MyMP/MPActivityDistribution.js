import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    CardActionArea,
    Button,
    Divider,
    IconButton, Typography
} from '@material-ui/core';
import Radar from 'react-d3-radar'
import BillDialog from "../Dashboard/BillDialog";
import DescriptionDialog from "./DescriptionDialog";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import TableDialog from "./TableDialog";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '`calc(100% - 1px)%',
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
        fontWeight: 700
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
    const [tableContents, setTableContents] = React.useState([])

    const handleBarPieChartClickOpen = (rows) => {
        setTableContents(rows)
        setTableDialogOpen(true)
    }
    const handleBarPieChartClose = () => {
        setTableDialogOpen(false)
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
                <CardActionArea>
                <div className={classes.chartContainer}>
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
                        style={classes.title}

                    />
                </div>
                </CardActionArea>
            </CardContent>
            <Divider />
            <CardActions className={classes.actions}>
                <Button style={{fontWeight:40,textTransform:'none'}} onClick={()=>handleBarPieChartClickOpen(props.rows)}>
                    show more
                </Button>
            </CardActions>
            <TableDialog rows={tableContents} open={tableDialogOpen} onClose={handleBarPieChartClose} type={'radar'}> </TableDialog>
            <BillDialog billInfo={billInfo} open={billOpen} onClose={handleBillClose} />
            <DescriptionDialog
                open = {open}
                onClose={handleClose}
                d3={true}
                explaination={{title:"Mp Activity Distribution",
                    body:"From this radar chart," +
                        " we can measure the MP's activity in the parliament as well as which " +
                        "categories he/she are most active with, such as religion, economics, human right etc."}
                }
            />
        </Card>
    );
};

MPActivityDistribution.propTypes = {
    className: PropTypes.string
};

export default MPActivityDistribution;


