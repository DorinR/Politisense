import React, {useEffect} from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import BarChartWrapper from './Charts/Wrappers/BarChartWrapper'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import ChartCard from './ChartCard'
import RadarChart from './Charts/RadarChart'
import axios from "axios";
import {fetchUserRiding} from "../Navbar";

export default function CategoryDashboard () {
    const [categoryList, setCategoryList] = React.useState([])
    const [userRepresentative, setUserRepresentative] = React.useState('')
    const [representativeData, setRepresentativeData] = React.useState([])

    useEffect(() => {

        async function getAllBillsByRep (head) {
            console.log("im insdie the GETALLBILLS and the head "+head )
            let result = []
            await axios
                .get(`http://localhost:5000/api/bills/${head}/getAllBillsByRep`)
                .then(res => {
                    if (res.data.success) {
                        console.log(res.data.data)
                        result= res.data.data
                        setRepresentativeData(result)
                    }
                })
                .catch(err => console.error(err))
            return result
        }

        async function getData () {
            const user = JSON.parse(localStorage.getItem('user'))
            if (user) {
                const { email } = user
                const riding = await fetchUserRiding(email)
                const representative = await fetchRepresentative(riding)
                if(representative.length != 0 ){
                    console.log("inside the get data inside the if statement to set the user rep")
                    setUserRepresentative(representative)
                }
            }
        }
        getData()
        if(userRepresentative){
            getAllBillsByRep(userRepresentative).then(results => {

                 getAllCategoriesByRep(results).then(result =>
                    {if(result.length != 0){setCategoryList(result)}}
                )
                // if(categories.length != 0){setCategoryList(categories)}
                console.log('the bills are now from the generalDashboard are  '+results)
            })
        }

    }, [userRepresentative])

    async function fetchRepresentative (riding) {
        let result = ''
        await axios
            .get(
                `http://localhost:5000/api/representatives/${riding}/getRepresentative`
            )
            .then(res => {
                if (res.data.success) {
                    result = res.data.data.name
                }
            })
            .catch(err => console.error(err))
        return result
    }



  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
          {
              representativeData.length != 0 && categoryList.length != 0 ?
                  <Card>
                  <CardHeader />
                  <BarChartWrapper type='bar-pie' data = {representativeData} categories={categoryList}/>
                  <CardContent>
                      <Typography variant='body2' color='textSecondary' component='p'>
                          Voting record of your MP.
                      </Typography>
                  </CardContent>
              </Card>
                  : "Waiting !!"}

      </Grid>
      <Grid item xs={1}>
        <Grid container spacing={2}>
          <Grid item={12}>
            <ChartCard title='MP Voting Distribution'> <RadarChart /> </ChartCard>
          </Grid>
          <Grid item={12}>
            {/*<ChartCard title='Bipartisan Index'> <BarChartWrapper /> </ChartCard>*/}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

async function getAllCategoriesByRep(bills) {
    let categories = []
    let uniqueCategories= []
    if(bills.length != 0 ){
        for( let x = 0; x < bills.length; x++) {
            console.log(" inside the FOR LOOP "+ bills[x].billData)
            if(bills[x].billData.category.localeCompare('') != 0){
                categories.push(bills[x].billData.category)
                console.log("IM HERE INSIDE GET ALL CATEGORIES BY REP")
            }
        }
        if(categories.length != 0 ){
            for( let i = 0; i < categories.length; i++){
                if(uniqueCategories.indexOf(categories[i]) === -1) {
                    uniqueCategories.push(categories[i]);
                }
            }
        }
    }
    // console.log("the unique categories list is "+ un)
    return uniqueCategories
}