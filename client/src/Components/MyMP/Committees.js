import React,{useState,useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardContent,
    Grid,
    Typography,
    Avatar,
} from '@material-ui/core';
import Button from "@material-ui/core/Button";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import {getAllRolesByRep,getRepresentativeId} from "./Roles";
import {loadingTextTitle} from "./DescriptionDialog";
import DescriptionDialog from "./DescriptionDialog";
import {capitalizedName} from "./TableDialog";

const useStyles = makeStyles(theme => ({
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

const Committees = props => {
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
                const roles= await getAllRolesByRep('committee',props.userRepresentative)
                if(roles.length != 0){
                    setData(roles)
                }
            }
        }
        getData()
    },[props.userRepresentative])


    console.log(data)
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
                            Committees
                        </Typography>
                         <Typography variant="h5">{data? `${data.length} Committees`: 0}</Typography>
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <AccountBalanceIcon className={classes.icon}/>
                        </Avatar>
                    </Grid>
                </Grid>
                <div className={classes.difference}>
                    <li>
                        <Typography
                            className={classes.caption}
                            variant="caption"
                        >
                            { (data !== null) ? `${capitalizedName(loadingTextTitle(data[0]))}` : 'This MP is not a member of any'}
                        </Typography>
                    </li>
                    {data?
                        <Button color="primary" size="medium" style={{"fontSize":10 }} onClick={handleOpenAction}>details</Button>
                        :''
                    }
                    <DescriptionDialog open = {open} onClose={handleCloseAction} data={data? data : []} title={'Committees'}/>
                </div>
            </CardContent>
        </Card>
    );
};

Committees.propTypes = {
    className: PropTypes.string
};

export default Committees;
