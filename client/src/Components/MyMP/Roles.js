import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import DescriptionDialog from './DescriptionDialog'
import { capitalizedName, loadingTextTitle } from '../Dashboard/Utilities/CommonUsedFunctions'
import AssignmentIcon from '@material-ui/icons/Assignment'
import { getDescription } from '../Dashboard/General/MinisterHelpDialog'
import { titleCase } from '../Dashboard/General/GeneralDashboard'
import CountUp from 'react-countup'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: '#00bcd4',
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.success.dark
  },
  differenceValue: {
    color: theme.palette.success.dark,
    marginRight: theme.spacing(1)
  },
  caption: {
    marginLeft: theme.spacing(0)
  }
}))

const Roles = props => {
  const { className, ...rest } = props
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const handleOpenAction = () => {
    setOpen(true)
  }
  const handleCloseAction = () => {
    setOpen(false)
  }

  const [data, setData] = useState(null)
  useEffect(() => {
    async function getData () {
      if (props.userRepresentative) {
        const billsByRep = await getRepresentativeId(props.userRepresentative)
        console.log(billsByRep)
        const roles = await getAllRolesByRep('role', props.userRepresentative)
        if (roles && roles.length !== 0 && roles !== null) {
          const rolesWithDesc = await getAllDesc(roles)
          setData(rolesWithDesc)
        }
      }
    }
    getData()
  }, [props.userRepresentative])

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justify='space-between'
        >
          <Grid item>
            <Typography
              className={classes.title}
              color='textSecondary'
              gutterBottom
              variant='caption'
            >
                            Parliament Roles
            </Typography>
            <Grid item direction='row'>
              <Grid container direction='row'>
                <CountUp style={{ fontSize: 27 }} end={data ? data.length : 0}> </CountUp>
                <Typography style={{ marginTop: 3, marginLeft: 3 }} variant='h5'> {'roles'}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AssignmentIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <li>
            <Typography
              className={classes.caption}
              variant='caption'
            >
              {data ? (`${capitalizedName(loadingTextTitle(data[0]))}`) : 'This MP doesnt have roles'}
            </Typography>
          </li>

          {data ? <Button color='primary' size='medium' style={{ fontSize: 10 }} onClick={handleOpenAction}>details</Button> : ''}
          <DescriptionDialog open={open} onClose={handleCloseAction} data={data || []} title='Roles' />
        </div>
      </CardContent>
    </Card>
  )
}

Roles.propTypes = {
  className: PropTypes.string
}

export function mergeArrays (type, ...arrays) {
  let jointArray = []

  arrays.forEach(array => {
    jointArray = [...jointArray, ...array]
  })
  const test = [...new Set([...jointArray])]

  const testing = test.filter((thing, index, self) =>
    index === self.findIndex((t) => (
      t.title === thing.title && t.group === thing.group && t.toDate === thing.toDate && t.fromDate === thing.fromDate
    ))
  )

  if (testing.length === 0) {
    return null
  }
  if (type === 'role') {
    return testing.filter(item => item.group === 'none')
  }
  if (type === 'committee') {
    return testing.filter(item => item.type === 'committee')
  }
  if (type === 'association') {
    console.log(testing.filter(item => item.group.includes('association')))
    return testing.filter(item => item.group.includes('association'))
  }
}

export async function getAllRolesByRep (type, repName) {
  return axios
    .get(`http://localhost:5000/api/representatives/${repName}/getAllRolesByRep`)
    .then(res => {
      if (res.data.success) {
        console.log(res)
        const data = res.data.data
        const arrays = []
        data.forEach(arr => arrays.push(arr))
        console.log(arrays)
        const mpRoles = mergeArrays(type, arrays[0], arrays[1], arrays[2], arrays[3], arrays[4], arrays[5], arrays[6], arrays[7])

        console.log(mpRoles)
        const mpRolesSorted = sortingBasedOnDate(mpRoles)
        return mpRolesSorted
      }
    })
    .catch(console.error)
}
export async function getRepresentativeId (representative) {
  return axios
    .get(`http://localhost:5000/api/representatives/${representative}/getRepresentativeId`)
    .then(res => {
      if (res.data.success) {
        console.log(res)
        return res.data.data
      }
    })
    .catch(console.error)
}

export async function getAllDesc (arr) {
  arr.forEach(async (element) => {
    element.desc = await getDescription(titleCase(loadingTextTitle(element)))
    console.log(element.desc)
  })
  return arr
}

export function sortingBasedOnDate (arr) {
  arr.sort((a, b) => {
    if (a.fromDate === 0 || b.fromDate === 0) {
      return -1
    } else {
      if (a.fromDate > b.fromDate) {
        return -1
      } else {
        return 1
      }
    }
  })
  return arr
}
export default Roles
