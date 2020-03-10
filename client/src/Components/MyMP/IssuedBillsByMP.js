import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardContent,
    Button, Grid, Typography, Avatar
} from '@material-ui/core';
import DescriptionDialog from "./DescriptionDialog";
import clsx from 'clsx';
import WorkIcon from '@material-ui/icons/Work';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import {capitalizedName} from "./TableDialog";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
    },
    content: {
        alignItems: 'center',
        display: 'flex'
    },
    title: {
        fontWeight: 700
    },
    avatar: {
        backgroundColor: "#00bcd4",
        color: theme.palette.primary.contrastText,
        height: 56,
        width: 56
    },
    icon: {
        height: 32,
        width: 32,
    },
    difference: {
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center'
    },
    caption:{
        marginLeft: theme.spacing(0)
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
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    console.log(props.userRepIssuedBills)
    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
    };

    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}
        >
            <CardContent>
                <Grid
                    container
                    justify="space-between"
                >
                    <Grid item>
                        <Typography
                            className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="caption"
                        >
                            Sponsored Bills
                        </Typography>
                        <Typography variant="h5"> {props.userRepIssuedBills? props.userRepIssuedBills.length+" bills" : '0 bills'}</Typography>
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <WorkIcon className={classes.icon} />
                        </Avatar>
                    </Grid>
                </Grid>
                <Grid container direction={"row"} >
                    <div className={classes.difference}>
                        <li>
                            <Typography
                                className={classes.caption}
                                variant="caption"
                            >
                                {props.userRepIssuedBills? 'Bill '+ props.userRepIssuedBills[0].billsClassified.number + '-'+
                                    capitalizedName(props.userRepIssuedBills[0].billsClassified.category) : "no bills created"
                                }
                            </Typography>
                        </li>
                          <Button color="primary" size="medium" style={{"fontSize":10 }} onClick={handleClickOpen}>
                                    details
                           </Button>

                    </div>
                </Grid>
            </CardContent>
            <DescriptionDialog open = {open}
                               onClose={handleClose}
                               explaination={{title:"Issued Bills By MP",
                                          body:"Issued Bills By Mp are the bills that that Mp sponsered and created about certain topic. " +
                                              "It is an indication how active he or she is in the parliament"}
                                      }
                               d3Container={true}
                               userRepIssuedBills ={props.userRepIssuedBills}
                               categoryList={props.categoryList}
                               maxWidth={"l"} fullWidth={true}
                               fullScreen={fullScreen}
                               rows={props.rows}
            />
        </Card>

    );
};

IssuedBillsByMP.propTypes = {
    className: PropTypes.string
};

export default IssuedBillsByMP;