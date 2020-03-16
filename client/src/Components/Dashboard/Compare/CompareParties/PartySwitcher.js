/* eslint-disable */
import React, { useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import axios from 'axios'
import InputLabel from '@material-ui/core/InputLabel'
import capitalize from 'capitalize'

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

async function fetchAllRepresentatives() {
  return await axios
    .get('http://localhost:5000/api/representatives/getAllRepresentatives')
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(err => console.error(err))
}

function getAllParties(representatives) {
  let parties = []
  let party
  representatives.forEach(rep => {
    party = capitalize.words(rep.politicalParty)
    if (!parties.includes(party)) {
      parties.push(party)
    }
  })
  return parties
}

function getStyles(selectedParty, party, theme) {
  return {
    fontWeight:
      selectedParty === party
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  }
}

export default function PartySwitcher(props) {
  // eslint-disable-next-line no-use-before-define
  const { functionUpdate, ...other } = props
  const classes = useStyles()
  const theme = useTheme()
  const [selectedParty, setSelectedParty] = React.useState([])
  const [dropdownParties, setDropdownParties] = React.useState([])

  function populateDropdownParties(parties) {
    setDropdownParties(parties)
  }

  function handleChange(event) {
    setSelectedParty(event.target.value)
    const value = event.target.value
    functionUpdate(value)
  }

  useEffect(() => {
    async function getData() {
      const representatives = await fetchAllRepresentatives() // REPLACE WITH NEXT LINE ONCE IMPLEMENTED
      if (representatives) {
        const parties = getAllParties(representatives)
        populateDropdownParties(parties)
      }
    }
    getData()
  }, [selectedParty])

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id='demo-simple-select-disabled-label'>
          Choose a Political Party
        </InputLabel>
        <Select
          value={selectedParty}
          onChange={handleChange}
          input={<Input />}
          MenuProps={MenuProps}>
          {dropdownParties.map(party => (
            <MenuItem
              key={party}
              value={party}
              style={getStyles(selectedParty, party, theme)}>
              {party}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
