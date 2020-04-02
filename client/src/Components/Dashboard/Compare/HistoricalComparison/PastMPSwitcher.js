import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import axios from 'axios'
import InputLabel from '@material-ui/core/InputLabel'
import Avatar from '@material-ui/core/Avatar'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { fetchUserRiding, capitalizedName, getPortraitColor } from '../../Utilities/CommonUsedFunctions'

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

  function getRep (reps, start) {
    let mp = {}
    for (let i = 0; i < reps.length; i++) {
      if (reps[i].start === start) {
        mp = reps[i]
      }
    }
    return mp
  }

  function handleChange (event) {
    setMp(event.target.value)
    const mp = getRep(dropdownMps, event.target.value)
    functionUpdate(mp)
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
              key={mp.start}
              value={mp.start}
            >
              <ListItem alignItems='flex-start'>
                <ListItemAvatar>
                  <Avatar
                    style={getPortraitColor(mp.party)}
                    src={mp.imageUrl} className={classes.avatar}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      <Typography>
                        {capitalizedName(mp.name)}
                      </Typography>
                    </>
                  }
                  secondary={
                    <>
                      <Typography
                        component='span'
                        variant='body2'
                        className={classes.inline}
                        color='textPrimary'
                      >
                        ({mp.start}-{mp.end})
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
