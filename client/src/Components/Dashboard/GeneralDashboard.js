import React, {useEffect} from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import BarChartWrapper from './Charts/Wrappers/BarChartWrapper'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import ChartCard from './ChartCard'
import Radar from 'react-d3-radar'
import axios from "axios";
import {fetchUserRiding} from "../Navbar";

export default function CategoryDashboard () {
    const [categoryList, setCategoryList] = React.useState([])
    const [userRepresentative, setUserRepresentative] = React.useState('')
    const [representativeData, setRepresentativeData] = React.useState([])
    const [radarData, setRadarData] = React.useState([])
    const [categoryListLoaded, setCategoryListLoaded] = React.useState(false)
    const [repDataLoaded, setRepDataLoaded] = React.useState(false)

    console.log(categoryList)
    console.log(userRepresentative)
    console.log(representativeData)
    console.log(radarData)


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
                        console.log(res.data.data.length)
                        setRepresentativeData(result)
                        setRepDataLoaded(true)
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
                    setUserRepresentative(representative)
                }
            }
        }
        getData()
        if(userRepresentative){
            getAllBillsByRep(userRepresentative).then(results => {

                 getAllCategoriesByRep(results).then(result =>
                    {
                        if(result.length != 0){
                            setCategoryList(result)
                            setCategoryListLoaded(true)
                        }
                    }
                )
            })
        }

        console.log(categoryList.length != 0, representativeData.length != 0)

        if(categoryListLoaded && repDataLoaded){
            createDataSetRadar(categoryList,representativeData).then(testing => {
                console.log(testing)
                if(testing.length != 0){
                    setRadarData(testing)
                    console.log("testing "+ testing)
                }
            })

        }

    }, [userRepresentative, repDataLoaded, categoryListLoaded])

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
    <Grid container spacing={1}>
      <Grid item xs={12}>
          {
              representativeData.length != 0 && categoryList.length != 0 ?
                  <Card>
                  <CardHeader />
                      <BarChartWrapper type='bar-pie' data = {representativeData} categories={categoryList}/>
                  {/*<CardContent>*/}
                  {/*    <Typography variant='body2' color='textSecondary' component='p'>*/}
                  {/*        Voting record of your MP.*/}
                  {/*    </Typography>*/}
                  {/*</CardContent>*/}
              </Card>
                  : "Waiting !!"}

      </Grid>

        {radarData.length !== 0 && categoryList.length !==0 ?

            <Grid item xs={12}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <ChartCard title='MP Voting Distribution'>
                        <Radar
                        width={500}
                        height={500}
                        padding={70}
                        domainMax={35}
                        highlighted={true}
                        onHover={(point) => {
                            if (point) {
                                console.log('hovered over a data point');
                            } else {
                                console.log('not over anything');
                            }
                        }}
                        data={{
                            variables: [
                                {key: 'trade', label: 'trade'},
                                {key: 'criminal', label: 'criminal'},
                                {key: 'business', label: 'business'},
                            ],
                            sets: [
                                {
                                    values: radarData
                                    ,
                                },
                            ],
                        }}
                    /> </ChartCard>
                </Grid>
                <Grid item item xs={6}>
                    <ChartCard title='Bipartisan Index'> <BarChartWrapper type={"donut"}/> </ChartCard>
                </Grid>
            </Grid>
        </Grid> : "STILL LOADING"}

    </Grid>
  )
}

export async function getAllCategoriesByRep(bills) {
    let categories = []
    let uniqueCategories= []
    if(bills.length != 0 ){

        for( let x = 0; x < bills.length; x++) {
            if(bills[x].billData.category.localeCompare('') != 0){
                categories.push(bills[x].billData.category)
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
    return uniqueCategories
}

export async function createDataSetRadar(categories,data){
    let dataArray = []
    let temp = {}
    let dataSetRadar= {}
    console.log("im here !!!!!!!!",data.length )

    categories.forEach(category => {
        let totalvotes = 0
        data.forEach(bill=>{
            if(bill.billData.category === category.toLowerCase()){
                totalvotes++
            }
        })
        let categorySmallLetter =category.toLowerCase().trim()
        temp = { category : categorySmallLetter,value : totalvotes }
        console.log(temp)
        dataArray.push(temp)
    })
    console.log(dataArray)

    dataArray.forEach(category => {
        if (category.category){
            dataSetRadar[category.category] = category.value
        }
    })
    console.log(dataSetRadar)


    return dataSetRadar
}

export async function createDataSetDonut(categories,data){
    let dataArray = []
    let temp = {}
    let dataSetRadar= {}
    console.log("im here !!!!!!!!",data.length )

    categories.forEach(category => {
        let totalvotes = 0
        data.forEach(bill=>{
            if(bill.billData.category === category.toLowerCase()){
                totalvotes++
            }
        })
        let categorySmallLetter =category.toLowerCase().trim()
        temp = { category : categorySmallLetter,value : totalvotes }
        console.log(temp)
        dataArray.push(temp)
    })
    console.log(dataArray)

    dataArray.forEach(category => {
        if (category.category){
            dataSetRadar[category.category] = category.value
        }
    })
    console.log(dataSetRadar)


    return dataSetRadar
}