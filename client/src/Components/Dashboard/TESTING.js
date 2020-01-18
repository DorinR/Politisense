import React, {useEffect, useState} from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import BarChartWrapper from './Charts/Wrappers/BarChartWrapper'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import ChartCard from './ChartCard'
import RadarChart from './Charts/RadarChart'
import RepresentativeImage from "./Sidebar/RepresentativeImage"
import RepresentativeInfo from "./Sidebar/RepresentativeInfo";
import MpsSwitcher from "./MpsSwitcher";
import {updateUserCategory} from "./CategoryGrid";
import HeadInfo from "./HeadInfo";
import axios from "axios";

export default function TESTING (props) {


    return (
        <div>
            <Grid container spacing={4} direction="row">
                <ChartCard title='Similarities'> <BarChartWrapper /> </ChartCard>
            </Grid>

        </div>

    )



}