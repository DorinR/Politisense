import React from 'react';
import PropTypes from 'prop-types';
import BarChartWrapper from "../Dashboard/Charts/Wrappers/BarChartWrapper";
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Button
} from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import IconButton from '@material-ui/core/IconButton';
import BillDialog from "../Dashboard/BillDialog";
import TableDialog from "./TableDialog";
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import DescriptionDialog from "./DescriptionDialog";
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
    const [isFlipped,setIsFlipped]= React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
    };

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
                    <IconButton aria-label="settings">
                        <HelpOutlineOutlinedIcon onClick={handleClickOpen}/>
                    </IconButton>
                }
                title="MP's Activity and Bills Proposed"
            />
            <Divider />
            <CardContent>
                <CardActionArea>
                <div className={classes.chartContainer}>
                    <BarChartWrapper
                        type="bar-pie"
                        data={props.userRepIssuedBills}
                        categories={props.categoryList}
                    />
                    </div>
                </CardActionArea>
            </CardContent>
            <Divider />
            <CardActions className={classes.actions}>
                    <Button style={{fontWeight:40,textTransform:'none'}}onClick={()=>handleBarPieChartClickOpen(props.rows)}>
                    show more
                    </Button>
            </CardActions>
            <BillDialog billInfo={billInfo} open={billOpen} onClose={handleBillClose} />
            <TableDialog rows={tableContents} open={tableDialogOpen} onClose={handleBarPieChartClose} type={'bar-pie'}> </TableDialog>
            <DescriptionDialog open = {open}
                               onClose={handleClose}
                               d3={true}
                               explaination={{title:"Issued Bills By MP",
                                          body:"Issued Bills By Mp are the bills that that Mp sponsered and created about certain topic. " +
                                              "It is an indication how active he or she is in the parliament"}
                                      }
            />
        </Card>

    );
};

IssuedBillsByMP.propTypes = {
    className: PropTypes.string
};

export default IssuedBillsByMP;