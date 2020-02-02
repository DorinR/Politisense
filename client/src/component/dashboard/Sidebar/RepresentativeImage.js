import React, { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'

const Firestore = require('../../../backend/firebase/Firestore').Firestore

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
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    const db = new Firestore()
    db.Politician()
      .select('name', '==', props.representativeToLoad)
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.')
          return
        }
        snapshot.forEach(doc => {
          const { name, imageUrl } = doc.data()
          setName(name)
          setImageUrl(imageUrl)
        })
      })
      .catch(err => {
        console.log('Error getting documents', err)
      })
  })
  return <Avatar alt={name} src={imageUrl} className={classes.bigAvatar} />
}
