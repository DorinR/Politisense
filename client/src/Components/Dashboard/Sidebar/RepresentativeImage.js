import React, { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'

export async function fetchUserRiding (userEmail) {
  return axios
    .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
    .then(res => {
      if (res.data.success) {
        return res.data.data.riding
      }
    })
    .catch(console.error)
}

export async function fetchRepresentative (riding) {
  return axios
    .get(
      `http://localhost:5000/api/representatives/${riding}/getRepresentative`
    )
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

const useStyles = makeStyles(theme => ({
  bigAvatar: {
    marginLeft: 26,
    width: 150,
    height: 150,
    border: '3px solid #41aaa8'
  }
}))

export default function RepresentativeImage (props) {
  const classes = useStyles()
  const [user, setUser] = useState(null)
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const user = JSON.parse(localStorage.getItem('user'))
    setUser(user)
  }, [])

  const [riding, setRiding] = useState(props.representativeToLoad)
  useEffect(() => {
    async function getData () {
      if (user && !riding) {
        const riding = await fetchUserRiding(user.email)
        setRiding(riding)
      }
    }
    getData()
  }, [user, riding])

  const [representative, setRepresentative] = useState(null)
  useEffect(() => {
    async function getData () {
      if (riding) {
        const rep = await fetchRepresentative(riding)
        setRepresentative(rep)
      }
    }
    getData()
  }, [riding])

  const [name, setName] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    if (representative) {
      setName(representative.name)
      setImageUrl(representative.imageUrl)
    }
  }, [representative])

  return <Avatar alt={name} src={imageUrl} className={classes.bigAvatar} />
}
