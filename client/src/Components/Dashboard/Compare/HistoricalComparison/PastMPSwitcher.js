/* eslint-disable */
import React, { useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import axios from 'axios'
import InputLabel from '@material-ui/core/InputLabel'
import Avatar from '@material-ui/core/Avatar'

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

function capitalize(str) {
    if (str && isNaN(str)) {
        let res = str
        res = res
            .toLowerCase()
            .split(' ')
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ')
        return res
    }
    return null
}

async function fetchPastRepresentatives(riding) {
    let pastRepresentatives = []
    await axios
        .get(`/api/representatives/${riding}/getPastRepresentatives`)
        .then(res => {
            if (res.data.success) {
                pastRepresentatives = res.data.data
            }
        })
        .catch(err => console.error(err))
    return pastRepresentatives
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

function getPartyColor(partyName) {

    switch (partyName) {
        case 'liberal':
            return {
                backgroundColor: '#D71921',
                color: 'white'
            }
        case 'conservative':
            return {
                backgroundColor: '#0C499C',
                color: 'white'
            }
        case 'ndp':
            return {
                backgroundColor: '#EF7E52',
                color: 'white'
            }
        case 'bloc québécois':
            return {
                backgroundColor: '#02819E',
                color: 'white'
            }
        case 'green party':
            return {
                backgroundColor: '#2E8724',
                color: 'white'
            }
        case 'independent':
            return {
                backgroundColor: 'black',
                color: 'white'
            }
        default:
            //backgroundColor = 'white'
            break
    }
}

export default function PastMPSwitcher(props) {
    // // eslint-disable-next-line no-use-before-define
    const { functionUpdate, ...other } = props
    const classes = useStyles()
    const [mp, setMp] = React.useState([])
    const [dropdownMps, setDropdownMps] = React.useState([])

    async function populateDropdownMps(mps) {
        setDropdownMps(mps)
    }

    function handleChange(event) {
        setMp(event.target.value)
        const value = event.target.value
        console.log(value)
        functionUpdate(value)

    }

    useEffect(() => {
        async function getData() {
            const user = JSON.parse(localStorage.getItem('user'))
            const riding = await fetchUserRiding(user.email)
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
                    key={mp.name}
                    onChange={handleChange}
                    input={<Input />}
                    MenuProps={MenuProps}>
                    {dropdownMps.map(mp => (
                        <MenuItem
                            key={mp.name}
                            value={mp}
                            style={{ font: 'white' }}
                            style={getPartyColor(mp.party)}>
                            <Avatar style={{
                                marginRight: 26,
                                width: 40,
                                height: 40,
                                border: '3px solid #41aaa8'
                            }}
                                alt={name} src={mp.imageUrl} className={classes.bigAvatar} />
                            {capitalize(mp.name)} ({mp.start}-{mp.end})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div >
    )
}
