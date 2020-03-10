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

async function fetchAllRepresentatives () {
  let representatives = []
  await axios
    .get('/api/representatives/getAllRepresentatives')
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

function getStyles (name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  }
}
export default function MpsSwitcher (props) {
  // eslint-disable-next-line no-unused-vars
  const { functionUpdate, ...other } = props
  const classes = useStyles()
  const theme = useTheme()
  const [mp, setMp] = React.useState([])
  const [dropdownMps, setDropdownMps] = React.useState([])

  async function populateDropdownMps (mps) {
    setDropdownMps(mps)
  }

  function handleChange (event) {
    setMp(event.target.value)
    const value = event.target.value
    functionUpdate(value)
  }

  useEffect(() => {
    async function getData () {
      const representatives = await fetchAllRepresentatives()
      populateDropdownMps(representatives)
    }
    getData()
  }, [mp])
  /* eslint-disable */
  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id='demo-simple-select-disabled-label'>
          Choose a Politician
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
              {mp.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
