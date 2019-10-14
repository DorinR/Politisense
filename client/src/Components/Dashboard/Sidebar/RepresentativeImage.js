import React from 'react'
import firebase from '../../../config/Firebase'
import Avatar from '@material-ui/core/Avatar'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  bigAvatar: {
    margin: 1,
    width: 120,
    height: 120,
    border: '3px solid #41aaa8'
  }
})

class RepresentativeImage extends React.Component {
  state = {
    name: '',
    imageUrl: ''
  }

  constructor(props) {
    super(props)
    let db = firebase.firestore()
    let representativesRef = db.collection('representatives')
    let query = representativesRef
      query
      .where('name', '==', this.props.representativeToLoad)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.')
          return
        }
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data())
          let { name, imageUrl } = doc.data()
          this.setState({
            name,
            imageUrl
          })
        })
      })
      .catch(err => {
        console.log('Error getting documents', err)
      })
  }

  render() {
    const { classes } = this.props

    return (
      <Avatar
        alt={this.state.name}
        src={this.state.imageUrl}
        className={classes.bigAvatar}
      />
    )
  }
}

export default withStyles(styles)(RepresentativeImage)
