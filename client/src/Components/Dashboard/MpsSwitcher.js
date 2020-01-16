import React, { useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import axios from 'axios'
import InputLabel from '@material-ui/core/InputLabel'
import RepresentativeInfo from "./Sidebar/RepresentativeInfo";
import RepresentativeImage from "./Sidebar/RepresentativeImage";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(0),
        minWidth: 200,
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

async function fetchAllRepresentatives () {
    let representatives = []
    await axios
        .get('http://localhost:5000/api/representatives/getAllRepresentatives')
        .then(res => {
            if (res.data.success) {
                representatives = res.data.data
            }
        })
        .catch(err => console.error(err))
    return representatives
}


function getStyles (name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium
    }
}
export default function MpsSwitcher (props) {
    const { functionUpdate, ...other } = props
    const classes = useStyles()
    const theme = useTheme()
    const [mp, setMp] = React.useState([])
    const [dropdownMps,setDropdownMps]= React.useState([])

    async function populateDropdownMps (mps) {
        setDropdownMps(mps)
    }

    function handleChange(event) {
        setMp(event.target.value)
        let value= event.target.value
        functionUpdate(value)
    }

    useEffect(() => {
        async function getData () {
            const representatives = await fetchAllRepresentatives()
            populateDropdownMps(representatives)
        }
        getData()
        console.log("the current MP is " + mp)

    }, [mp])

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-disabled-label">Choose a Politician</InputLabel>
                <Select
                    value={mp}
                    onChange={handleChange}
                    input={<Input />}
                    MenuProps={MenuProps}
                >
                    {dropdownMps.map(riding => (
                        <MenuItem
                            key={riding.name}
                            value={riding.name}
                            style={getStyles(riding.name, riding.name, theme)}
                        >
                            {riding.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}


