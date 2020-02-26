/* eslint-disable */
import React, { useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import axios from 'axios'
import InputLabel from '@material-ui/core/InputLabel'

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(0),
        minWidth: 250,
        maxWidth: 500
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    chip: {
        margin: 2
    },
    noLabel: {
        marginTop: theme.spacing(3)
    }
}))

async function fetchParliament42() {
    let parliament42 = []
    await axios
        .get('http://localhost:5000/api/representatives/Parliament42')
        .then(res => {
            if (res.data.success) {
                parliament42 = res.data.data
            }
        })
        .catch(err => console.error(err))
}

async function fetchParliament41() {
    let parliament41 = []
    await axios
        .get('http://localhost:5000/api/representatives/Parliament41')
        .then(res => {
            if (res.data.success) {
                parliament41 = res.data.data
            }
        })
        .catch(err => console.error(err))
}


async function fetchParliament41() {
    let parliament40 = []
    await axios
        .get('http://localhost:5000/api/representatives/Parliament40')
        .then(res => {
            if (res.data.success) {
                parliament40 = res.data.data
            }
        })
        .catch(err => console.error(err))
}

async function fetchParliament39() {
    let parliament39 = []
    await axios
        .get('http://localhost:5000/api/representatives/Parliament39')
        .then(res => {
            if (res.data.success) {
                parliament39 = res.data.data
            }
        })
        .catch(err => console.error(err))
}

async function fetchParliament38() {
    let parliament38 = []
    await axios
        .get('http://localhost:5000/api/representatives/Parliament38')
        .then(res => {
            if (res.data.success) {
                parliament38 = res.data.data
            }
        })
        .catch(err => console.error(err))
}

async function fetchParliament37() {
    let parliament37 = []
    await axios
        .get('http://localhost:5000/api/representatives/Parliament37')
        .then(res => {
            if (res.data.success) {
                parliament37 = res.data.data
            }
        })
        .catch(err => console.error(err))
}

export default function PastMPSwitcher(props) {
    // // eslint-disable-next-line no-use-before-define
    const { functionUpdate, ...other } = props
    const classes = useStyles()
    const [mp, setMp] = React.useState([])

    function handleChange(event) {
        setMp(event.target.value)
        const value = event.target.value
        functionUpdate(value)
    }

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id='demo-simple-select-disabled-label'>
                    Choose a time period
        </InputLabel>
                <Select value={mp} onChange={handleChange}>
                    <MenuItem key={mp.name} value={mp.name} >2001 - 2004 (37)</MenuItem>
                    <MenuItem key={mp.name} value={mp.name} >2004 - 2005 (38)</MenuItem>
                    <MenuItem key={mp.name} value={mp.name} >2006 - 2008 (39)</MenuItem>
                    <MenuItem key={mp.name} value={mp.name} >2008 - 2011 (40)</MenuItem>
                    <MenuItem key={mp.name} value={mp.name} >2011 - 2015 (41)</MenuItem>
                    <MenuItem key={mp.name} value={mp.name} >2015 - 2019 (42)</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
}
