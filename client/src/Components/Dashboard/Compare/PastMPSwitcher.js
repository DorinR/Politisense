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

async function fetchPastRepresentatives(riding) {
    let pastRepresentatives = []
    await axios
        .get(`/api/representatives/${riding}/getPastRepresentatives`)
        .then(res => {
            if (res.data.success) {
                console.log(res.data.success)
                pastRepresentatives = res.data.data
            }
        })
        .catch(err => console.error(err))
    console.log(pastRepresentatives)
    return pastRepresentatives
}

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium
    }
}

async function fetchUserRiding(userEmail) {
    return axios
        .get(`/api/users/${userEmail}/getUser`)
        .then(res => {
            if (res.data.success) {
                return res.data.data.riding
            }
        })
        .catch(console.error)
}

export default function PastMPSwitcher(props) {
    // // eslint-disable-next-line no-use-before-define
    const { functionUpdate, ...other } = props
    const classes = useStyles()
    const theme = useTheme()
    const [mp, setMp] = React.useState([])
    const [dropdownMps, setDropdownMps] = React.useState([])

    async function populateDropdownMps(mps) {
        setDropdownMps(mps)
    }

    function handleChange(event) {
        setMp(event.target.value)
        const value = event.target.value
        functionUpdate(value)
    }

    useEffect(() => {
        async function getData() {
            const user = JSON.parse(localStorage.getItem('user'))
            const riding = await fetchUserRiding(user.email)
            console.log(riding)
            const pastRepresentatives = await fetchPastRepresentatives(riding)
            populateDropdownMps(pastRepresentatives)
        }
        getData()
    }, [mp])

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id='demo-simple-select-disabled-label'>
                    Choose a time period
        </InputLabel>
                <Select
                    value={mp}
                    onChange={handleChange}
                    input={<Input />}
                    MenuProps={MenuProps}>
                    {dropdownMps.map(mp => (
                        <MenuItem
                            key={mp.name}
                            value={mp.name}
                            style={getStyles(mp.name, mp.name, theme)}>
                            {mp.name} ({mp.start}-{mp.end})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}
