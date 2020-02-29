import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import HistoryIcon from '@material-ui/icons/History';
import Button from "@material-ui/core/Button";
import D3ChartDescriptionDialog from "./D3ChartDescriptionDialog";
import axios from "axios";
const useStyles = makeStyles(theme => ({
    root: {
        height: '100%'
    },
    content: {
        alignItems: 'center',
        display: 'flex'
    },
    title: {
        fontWeight: 700
    },
    avatar: {
        backgroundColor: theme.palette.success.main,
        height: 56,
        width: 56
    },
    icon: {
        height: 32,
        width: 32
    },
    difference: {
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center'
    },
    differenceIcon: {
        color: theme.palette.success.dark
    },
    differenceValue: {
        color: theme.palette.success.dark,
        marginRight: theme.spacing(1)
    }
}));

const TotalUsers = props => {
    const { className, ...rest } = props;

    const classes = useStyles();
    const [open, setOpen]= useState(false)
    const handleOpenAction = ()=>{
        setOpen(true)
    }
    const handleCloseAction = ()=>{
        setOpen(false)
    }

    const[data,setData]= useState(null)
    useEffect(()=>{
        async function getData () {
            if (props.userRepresentative) {
                const billsByRep = await getRepresentativeId(props.userRepresentative)
                console.log(billsByRep)
                const roles= await getAllRolesByRep(props.userRepresentative)
            }
        }
        getData()
    },[props.userRepresentative])

    async function getAllRolesByRep (repName) {
        return axios
            .get(`http://localhost:5000/api/representatives/${repName}/getAllRolesByRep`)
            .then(res => {
                if (res.data.success) {
                    console.log(res)
                    return res.data.data
                }
            })
            .catch(console.error)
    }
    async function getRepresentativeId (representative) {
        return axios
            .get(`http://localhost:5000/api/representatives/${representative}/getRepresentativeId`)
            .then(res => {
                if (res.data.success) {
                    console.log(res)
                    return res.data.data
                }
            })
            .catch(console.error)
    }

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
                            Parliament ROLES
                        </Typography>
                        <Typography variant="h5">1,600</Typography>
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <HistoryIcon className={classes.icon} />
                        </Avatar>
                    </Grid>
                </Grid>
                <div className={classes.difference}>
                    <ArrowUpwardIcon className={classes.differenceIcon} />
                    <Typography
                        className={classes.differenceValue}
                        variant="body2"
                    >
                        16%
                    </Typography>
                    <Typography
                        className={classes.caption}
                        variant="caption"
                    >
                        Since last month
                    </Typography>
                    <Button color="primary" size="small" style={{"fontSize":9, "marginLeft":"30px"}} onClick={handleOpenAction}>details</Button>
                    <D3ChartDescriptionDialog open = {open} onClose={handleCloseAction}/>

                </div>
            </CardContent>
        </Card>
    );
};

TotalUsers.propTypes = {
    className: PropTypes.string
};

export default TotalUsers;