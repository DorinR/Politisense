import React, {useEffect, useState} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import {fetchRidingCode,fetchUserRiding,fetchRepresentative,RepresentativeInfo} from './Sidebar/RepresentativeInfo'
import RidingPopulation from './Sidebar/RidingPopulation/RidingPopulation'
import {formatNumber} from "./Budget/Budget";
import {capitalizedName} from "./Utilities/CommonUsedFunctions";
import Box from "@material-ui/core/Box";
import RidingShapeContainer from "./Sidebar/RidingShape/RidingShapeContainer";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'fit-content'
    },
    avatar: {
        width: 60,
        height: 60
    },
    name: {
        marginTop: theme.spacing(1),
        color: "white",
        fontFamily:'work-Sans,sans-serif'

    },
    fontColorTypography:{
        color: "white",
        fontFamily:'work-Sans,sans-serif'
    },
    shapeContainer:{
        marginLeft: theme.spacing(8),
        marginTop: theme.spacing(2),
    },
    containerLongRidingName: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'fit-content',
    },
    longRidingName:{
        color: "white",
        fontFamily:'work-Sans,sans-serif',
        textAlign: 'center'

}

}));



const MpProfile = props => {
    const { className, ...rest } = props;
    const classes = useStyles();
    const [name, setName] = useState('')
    const [politicalParty, setPoliticalParty] = useState('')
    const [riding, setRiding] = useState('')
    const [yearElected, setYearElected] = useState(1000)
    const [ridingCode, setRidingCode] = useState('')
    const [data, setData] = useState({})

    const user = {
        name: 'Shen Zhi',
        avatar: '/images/avatars/avatar_11.png',
        bio: 'Brain Director'
    };

    useEffect(() => {
        async function getData () {
            // eslint-disable-next-line
            const user = JSON.parse(localStorage.getItem('user'))
            const riding = await fetchUserRiding(user.email)
            const promises = await Promise.all([
                fetchRidingCode(riding),
                fetchRepresentative(riding)
            ])
            const ridingCode = promises[0]
            const { name, politicalParty, yearElected } = promises[1]
            if(name){
                setData({
                name: name,
                ridingCode: ridingCode,
                riding: riding,
                politicalParty: politicalParty,
                yearElected: yearElected
            })

            }
        }
            getData()


    }, [])

    useEffect(() => {
        setName(data.name)
        setPoliticalParty(data.politicalParty)
        setRiding(data.riding)
        setRidingCode(data.ridingCode)
        setYearElected(data.yearElected)
    }, [data])


    return (
        <div
            {...rest}
            className={clsx(classes.root, className)}
        >
            <Typography
                className={classes.name}
                variant="h6"
            >
                {capitalizedName(name)}
            </Typography>
            {riding && riding.length >22 ?
                <div className={classes.containerLongRidingName}>
                    <Typography className={classes.fontColorTypography} variant="caption">Represents</Typography>
                    <Typography className={classes.longRidingName} variant="caption">{capitalizedName(riding)}</Typography>
                </div>
                : <Typography className={classes.fontColorTypography} variant="caption">{"Represents: "+capitalizedName(riding)}</Typography>
            }

            <Typography className={classes.fontColorTypography} variant="caption" >{"Political Party: "+ capitalizedName(politicalParty)}</Typography>
            <Typography className={classes.fontColorTypography} variant="caption">{'Total Population: '} { riding? (<RidingPopulation riding={riding} />) :"N/A"}</Typography>
            <Typography className={classes.fontColorTypography} variant="caption">{'Elected: '+ yearElected}</Typography>
            <div className={classes.shapeContainer}>
            <RidingShapeContainer
                ridingCode={ridingCode}
                politicalParty={politicalParty}
            />
            </div>
        </div>
    );
};

MpProfile.propTypes = {
    className: PropTypes.string
};

export default MpProfile;