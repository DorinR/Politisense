import React from 'react'
import firebase from '../../../config/Firebase'
import ListItemText from '@material-ui/core/ListItemText'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Box from '@material-ui/core/Box'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const styles = theme => ({
  customCardContent: {
    padding: 5,
    paddingBottom: '5px!important',
    backgroundColor: '#f7f7f7'
  },
  customHeadingText: {
    color: '#41aaa8',
    fontStyle: 'italic',
    fontWeight: 'bold'
  }
})

class RepresentativeInfo extends React.Component {
  state = {
    name: '',
    politicalParty: '',
    riding: '',
    yearElected: 1000
  }

  constructor(props) {
    super(props)
    let db = firebase.firestore()
    let representativesRef = db.collection('representatives')
    let query = representativesRef
      .where('name', '==', this.props.representativeToLoad)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.')
          return
        }
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data())
          let { name, politicalParty, riding, yearElected } = doc.data()
          this.setState({
            name,
            politicalParty,
            riding,
            yearElected
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
      <ListItemText>
        <Card>
          <CardContent className={classes.customCardContent}>
            <Typography className={classes.customHeadingText}>NAME</Typography>
            {this.state.name}
          </CardContent>
        </Card>
        <Box m={1} />
        <Card>
          <CardContent className={classes.customCardContent}>
            <Typography className={classes.customHeadingText}>
              POLITICAL PARTY
            </Typography>
            {this.state.politicalParty}
          </CardContent>
        </Card>
        <Box m={1} />
        <Card>
          <CardContent className={classes.customCardContent}>
            <Typography className={classes.customHeadingText}>
              RIDING
            </Typography>
            {this.state.riding}
          </CardContent>
        </Card>
        <Box m={1} />
        <Card>
          <CardContent className={classes.customCardContent}>
            <Typography className={classes.customHeadingText}>
              YEAR ELECTED
            </Typography>
            {this.state.yearElected}
          </CardContent>
        </Card>
      </ListItemText>
    )
  }
}

export default withStyles(styles)(RepresentativeInfo)
