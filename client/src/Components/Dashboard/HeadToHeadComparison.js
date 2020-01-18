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
    const [head1Bills, setHead1Bills] = useState([])
    const [head2Bills, setHead2Bills] = useState([])

    function updatehead1Bills(data){
        setHead1Bills(data)
    }



    function renderChart(){
        if(head1Bills[0]){
            console.log(head1Bills)
            // let result = head1Bills
            // console.log(JSON.parse(result))
            return <ChartCard title='Bipartisan Index'> <BarChartWrapper data={head1Bills} categoryType = {props.title } /> </ChartCard>
        }else {
            return  "not exist"


        }
    }
    const updateHead1 = (head)=>{
        console.log("executed!!")
        setHead1(head)
    }

    const updateHead2 = (head)=>{
        setHead2(head)
    }

    useEffect( ()=>{

        console.log('Head 1 IS '+ head1)
        // async function getAllBillsByHead (head,type) {
        //     let result = []
        //     await axios
        //         .get(`http://localhost:5000/api/bills/${head}/getAllBillsByHead`)
        //         .then(res => {
        //             if (res.data.success) {
        //                 console.log(res.data.data)
        //                 result= res.data.data
        //                 if(type == 'head1'){
        //                     setHead1Bills(result)
        //                 }
        //                 else {
        //                     setHead2Bills(result)
        //                 }
        //             }
        //         })
        //         .catch(err => console.error(err))
        //     return result
        // }
        //  let test1 = getAllBillsByHead(head1,'head1').then(result=> {
        //      console.log(result)})
        // let test2 = getAllBillsByHead(head2,'head2').then(result=> {
        //     console.log(result)})

    })


    return (
        <div>
            <Grid container spacing={4} direction="row">
                <Grid item={1}>
                    <HeadInfo updateHead={updateHead1}/>
                </Grid>
                <Grid item={1}>
                    <HeadInfo updateHead={updateHead2}/>
                    {/*{head2Bills.length !=0 ? <ChartCard title='Bipartisan Index'> <BarChartWrapper data={head2Bills} /> </ChartCard>*/}
                    {/*    : "noTHING!!"}*/}
                </Grid>
            </Grid>

            <Grid container spacing={4} direction="row">
                {head1.length !=0 && head2.length != 0 ? <ChartCard title='Similarities'> <BarChartWrapper data={[head1,head2]}/> </ChartCard>
                    : "   DO  NOTHING!!"}
            </Grid>

        </div>

    )
}
