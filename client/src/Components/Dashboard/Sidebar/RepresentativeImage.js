import React, { useEffect, useState } from 'react'
import firebase from '../../../config/Firebase'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme =>
  ({
    bigAvatar: {
      margin: 1,
      width: 120,
      height: 120,
      border: '3px solid #41aaa8'
    }
  }))

export default function RepresentativeImage (props) {
  const classes = useStyles()
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    const db = firebase.firestore()
    const query = db.collection('representatives')
    query
      .where('name', '==', props.representativeToLoad)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.')
          return
        }
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data())
          const { name, imageUrl } = doc.data()
          setName(name)
          setImageUrl(imageUrl)
        })
      })
      .catch(err => {
        console.log('Error getting documents', err)
      })
  })
  return (
    <Avatar
      alt={name}
      src={imageUrl}
      className={classes.bigAvatar}
    />
  )
}
