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

export default function HeadToHeadComparison (props) {
    const [head1,setHead1]= useState('')
    const [head2,setHead2]= useState('')

    const updateHead1 = (head)=>{
        setHead1(head)
    }

    const updateHead2 = (head)=>{
        setHead2(head)
    }

    useEffect(()=>{


        console.log('Head 1 IS '+ head1)

        async function getAllBillsByHead (head) {
            let bills = []
            await axios
                .get(`http://localhost:5000/api/bills/${head}/getAllBillsByHead`)
                .then(res => {
                    if (res.data.success) {
                        bills = res.data.data
                        console.log(" BILLS ARE "+ bills[1])
                    }
                })
                .catch(err => console.error(err))
            return bills
        }
        getAllBillsByHead(head1).then(res =>{
            console.log('res is from getALLBills HEAD line 51'+ res)
            console.log('inside the useeffect CALLING  getAllBillsByHead in then!')
        })
        // console.log('Head 1 '+ head1)
        // console.log('Head 2 '+ head2)



    },[head1,head2])
    return (
        <div>
            <Grid container spacing={4} direction="row">
                <Grid item={1}>
                    <HeadInfo updateHead={updateHead1}/>
                    <ChartCard title='Bipartisan Index'> <BarChartWrapper categoryType = {props.title} /> </ChartCard>

                </Grid>
                <Grid item={1}>
                    <HeadInfo updateHead={updateHead2}/>
                    <ChartCard title='Bipartisan Index'> <BarChartWrapper categoryType = {props.title} /> </ChartCard>
                </Grid>
            </Grid>

            <Grid container spacing={4} direction="row">

            </Grid>

        </div>

    )
}



