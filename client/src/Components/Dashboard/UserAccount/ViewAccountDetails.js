import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import axios from 'axios'
import CenteredCircularProgress from '../Utilities/CenteredCircularProgress'

export async function fetchUserData (userEmail) {
  return axios
    .get(`/api/users/${userEmail}/getUser`, { params: { acctdet: userEmail } })
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

export default function ViewAccountDetails () {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function getData () {
      if (!user) {
        // eslint-disable-next-line no-undef
        const usr = JSON.parse(localStorage.getItem('user'))
        const fullUserDetails = await fetchUserData(usr.email)
        setUser(fullUserDetails)
      }
    }
    getData()
  }, [user])

  return (
    <div>
      {user ? (
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name='email'
                fullWidth
                id='email'
                label='Email'
                InputProps={{
                  readOnly: true
                }}
                value={user.email}
                variant='filled'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name='firstname'
                fullWidth
                id='firstName'
                label='First Name'
                InputProps={{
                  readOnly: true
                }}
                value={user.firstname}
                variant='filled'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name='lastName'
                variant='filled'
                fullWidth
                id='lastName'
                label='Last Name'
                InputProps={{
                  readOnly: true
                }}
                value={user.lastname}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name='postalCode'
                variant='filled'
                fullWidth
                id='postalCode'
                label='Postal Code'
                InputProps={{
                  readOnly: true
                }}
                value={user.postalCode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name='riding'
                variant='filled'
                fullWidth
                id='riding'
                label='Riding'
                InputProps={{
                  readOnly: true
                }}
                value={user.riding}
              />
            </Grid>
          </Grid>
        </Container>
      ) : (
        <Container>
          <br />
          <br />
          <br />
          <br />
          <CenteredCircularProgress />
        </Container>
      )}
    </div>
  )
}
