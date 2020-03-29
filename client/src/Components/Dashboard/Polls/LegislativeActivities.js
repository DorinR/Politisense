import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PollsNavbar from './PollsNavbar'
import Voting from './Voting'
import Typography from '@material-ui/core/Typography'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles(theme => ({
    content: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6)
    },
    customHeaders: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: '3em',
        marginLeft: '-46px'
    },
    customTooltip: {
        marginLeft: '5px',
        paddingTop: '20px'
    }
}))

export default function LegislativeActivities() {
    // eslint-disable-next-line no-use-before-define
    const classes = useStyles()

    // useEffect(() => {
    //     async function getData() {
    //         await getAllBillsByHead(pastRep, 'pastRep')
    //     }
    //     getData()
    // }, [pastRep])


    return (
        <>
            <CssBaseline />
            <div>
                <Container maxWidth='l'>
                    <div>
                        <Grid container spacing={12}>
                            <Grid item xs={12}>
                                <PollsNavbar />
                            </Grid>
                            <Grid item xs={12}>
                                <Voting />
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </div>
        </>
    )
}