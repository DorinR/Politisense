import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import axios from 'axios'
import InputLabel from '@material-ui/core/InputLabel'
import Avatar from '@material-ui/core/Avatar'
import { fetchUserRiding, capitalizedName, getPartyColor } from '../../Utilities/CommonUsedFunctions'

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

async function fetchPastRepresentatives (riding) {
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

export default function PastMPSwitcher (props) {
  // eslint-disable-next-line
  const { functionUpdate, ...other } = props
  const classes = useStyles()
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
      // eslint-disable-next-line
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
          MenuProps={MenuProps}
        >
          {dropdownMps.map(mp => (
            <MenuItem
              key={mp.name}
              value={mp}
              style={getPartyColor(mp.party)}
            >
              <Avatar
                style={{
                  marginRight: 26,
                  width: 40,
                  height: 40,
                  border: '3px solid #41aaa8'
                }}
                src={mp.imageUrl} className={classes.bigAvatar}
              />
              {capitalizedName(mp.name)} ({mp.start}-{mp.end})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
