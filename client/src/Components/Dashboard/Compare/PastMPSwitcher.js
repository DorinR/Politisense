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
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 9 + ITEM_PADDING_TOP,
            width: 350
        }
    }
}

async function fetchTimePeriods() {
    let timePeriods = []
    await axios
        .get('http://localhost:5000/api/representatives/getAllTimePeriods')
        .then(res => {
            if (res.data.success) {
                representatives = res.data.data
            }
        })
        .catch(err => console.error(err))
    return representatives.sort((mp1, mp2) => {
        return mp1.name.localeCompare(mp2.name)
    })
}

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium
    }
}
export default function PastMPSwitcher(props) {
    // // eslint-disable-next-line no-use-before-define
    // const { functionUpdate, ...other } = props
    const classes = useStyles()
    // const theme = useTheme()
    // const [mp, setMp] = React.useState([])
    // const [dropdownMps, setDropdownMps] = React.useState([])

    // async function populateDropdownMps(mps) {
    //     setDropdownMps(mps)
    // }

    // function handleChange(event) {
    //     setMp(event.target.value)
    //     const value = event.target.value
    //     functionUpdate(value)
    // }

    // useEffect(() => {
    //     async function getData() {
    //         const representatives = await fetchTimePeriods()
    //         populateDropdownMps(representatives)
    //     }
    //     getData()
    // }, [mp])

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id='demo-simple-select-disabled-label'>
                    Choose a time period
        </InputLabel>
                <Select>
                    <MenuItem value={10}>2001 - 2004 (37)</MenuItem>
                    <MenuItem value={10}>2004 - 2005 (38)</MenuItem>
                    <MenuItem value={10}>2006 - 2008 (39)</MenuItem>
                    <MenuItem value={10}>2008 - 2011 (40)</MenuItem>
                    <MenuItem value={20}>2011 - 2015 (41)</MenuItem>
                    <MenuItem value={30}>2015 - 2019 (42)</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
}
