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

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium
    }
}


function handleChange(event) {
    setMp(event.target.value)
    const value = event.target.value
    functionUpdate(value)
}

export default function PastMPSwitcher(props) {
    // // eslint-disable-next-line no-use-before-define
    const { functionUpdate, ...other } = props
    const classes = useStyles()
    const theme = useTheme()
    const [mp, setMp] = React.useState([])

    const pastMps = ['2001 - 2004 (37)',
        '2004 - 2005 (38)',
        '2006 - 2008 (39)',
        '2008 - 2011 (40)',
        '2011 - 2015 (41)',
        '2015 - 2019 (42)']

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
                <Select
                    value={mp}
                    onChange={handleChange}
                    input={<Input />}
                    MenuProps={MenuProps}>
                    {pastMps.map(mp => (
                        <MenuItem
                            key={mp.name}
                            value={mp.name}
                            style={getStyles(mp.name, mp.name, theme)}>
                            {mp.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}
