import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import axios from 'axios'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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

// All ridings currently stored in the backend
var dropdownRidings = []

// Parameters: list of ridings to be added to ridings dropdown
// Return: none
async function populateDropdownRidings (ridings) {
  const ridingsToAddToDropdown = await ridings
  dropdownRidings = ridingsToAddToDropdown
}

// Parameters: none
// Return: list of Representatives objects
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

// Parameters: list of representatives objects
// Return: list of ridings
export function getAllRidings (representatives) {
  const ridings = []
  representatives.forEach(rep => {
    ridings.push(rep.riding)
  })
  return ridings.sort()
}

// Parameters: email of user, new riding for that user.
// Return: none
export async function updateUserRiding (email, newRiding) {
  console.log(`email of user to update: ${email}`)
  console.log(`update riding to ${newRiding}`)
  const updateObject = {
    email: email,
    riding: newRiding
  }
  axios.put('http://localhost:5000/api/users/updateUserRiding', updateObject)
}

function getStyles (name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  }
}

export default function RidingSwitcher (props) {
  const classes = useStyles()
  const theme = useTheme()
  const [riding, setRiding] = React.useState([])

  const handleChange = event => {
    const user = JSON.parse(localStorage.getItem('user'))
    const { email } = user
    console.log('event.target.value', event.target)
    setRiding(event.target.value)
    updateUserRiding(email, event.target.value)
    window.location.reload(false)
  }

  useEffect(() => {
    setRiding(props.riding)
  }, [props.riding])

  useEffect(() => {
    async function getData () {
      const representatives = await fetchAllRepresentatives()
      const allRidings = getAllRidings(representatives)
      populateDropdownRidings(allRidings)
    }
    getData()
  }, [])

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          value={riding}
          onChange={handleChange}
          input={<Input />}
          MenuProps={MenuProps}
        >
          {dropdownRidings.map(riding => (
            <MenuItem
              key={riding}
              value={riding}
              style={getStyles(riding, riding, theme)}
            >
              {riding}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
