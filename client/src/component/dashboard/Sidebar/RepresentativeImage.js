import React, { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'

export async function getRepresentativeData(name) {
  return await axios
    .get(`http://localhost:5000/api/representatives/representative/${name}`)
    .then(res => {
      return res.data.data
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

export default function RepresentativeImage(props) {
  const classes = useStyles()
  const [user, setUser] = useState(null)
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const user = JSON.parse(localStorage.getItem('user'))
    setUser(user)
  }, [])

  const [riding, setRiding] = useState(props.representativeToLoad)
  useEffect(() => {
    async function getData() {
      if (user && !riding) {
        const riding = await fetchUserRiding(user.email)
        setRiding(riding)
      }
    }
    getData()
  }, [user, riding])

  const [representative, setRepresentative] = useState(null)
  useEffect(() => {
    const { name, imageUrl } = getRepresentativeData(props.representativeToLoad)
    setName(name)
    setImageUrl(imageUrl)
  })
  return <Avatar alt={name} src={imageUrl} className={classes.bigAvatar} />
}
