import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import axios from 'axios'

export async function fetchUserData (userEmail) {
  let result = ''
  await axios
    .get(`/api/users/${userEmail}/getUser`, { params: { acctdet: userEmail } })
    .then(res => {
      if (res.data.success) {
        const user = res.data.data
        result = user
      }
    })
    .catch(err => console.log(err))
  return result
}

export default function ViewAccountDetails () {
  const [email, setEmail] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [riding, setRiding] = useState('')

  useEffect(() => {
    async function getData () {
      // eslint-disable-next-line no-undef
      const user = JSON.parse(localStorage.getItem('user'))
      const fullUserDetails = await fetchUserData(user.email)
      const { firstname, lastname, postalCode, riding } = fullUserDetails
      setFirstname(firstname)
      setLastname(lastname)
      setEmail(email)
      setPostalCode(postalCode)
      setRiding(riding)
    }
    getData()
  })

  return (
    <div>
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
              value={email}
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
              value={firstname}
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
              value={lastname}
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
              value={postalCode}
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
              value={riding}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
