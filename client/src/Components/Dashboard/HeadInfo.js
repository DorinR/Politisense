import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import RepresentativeImage from "./Sidebar/RepresentativeImage";
import MpsSwitcher from "./MpsSwitcher";
const Firestore = require('../../Firebase').Firestore

const useStyles = makeStyles({
    card: {
        width: 500
    },
});
const gridStyle = {
    display: 'block',
    justifyContent: 'center'
}
export default function HeadInfo(props) {
    const { updateHead, ...other } = props
    const classes = useStyles();
    const [name, setName] = useState('')
    const [politicalParty, setPoliticalParty] = useState('')
    const [riding, setRiding] = useState('')
    const [yearElected, setYearElected] = useState(1000)
    //updateHands
    const updateNameFromSwitcher = (newName) =>{
        setName(newName)
        updateHead(newName)
        console.log('New Name'+newName)
    }

    useEffect(() => {
        if(name){
            const db = new Firestore()
            db.Politician()
                .select('name', '==', name)
                .then(snapshot => {
                    if (snapshot.empty) {
                        console.log('No matching documents.')
                        return
                    }
                    snapshot.forEach(doc => {
                        const { name, politicalParty, riding, yearElected } = doc.data()
                        setName(name)
                        setPoliticalParty(politicalParty)
                        setYearElected(yearElected)
                        setRiding(riding)
                    })
                })
                .catch(err => {
                    console.log('Error getting documents', err)
                })
        }
    })

    return (
        <Card className={classes.card} >
            <div className='contents' style={gridStyle}>
                <ListItemAvatar>
                    <RepresentativeImage representativeToLoad={name} />
                </ListItemAvatar>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {name}
                    </Typography>
                    <Typography className={classes.customHeadingText}>
                        POLITICAL PARTY
                    </Typography>
                    <span className={classes.customTextFormatting}>{politicalParty}</span>
                    <Typography className={classes.customHeadingText}>
                        Riding
                    </Typography>
                    <span className={classes.customTextFormatting}>{riding}</span>
                    <Typography className={classes.customHeadingText}>
                        Year Elected
                    </Typography>
                    <span className={classes.customTextFormatting}>{yearElected}</span>
                </CardContent>
                <CardActions>
                    <MpsSwitcher functionUpdate={updateNameFromSwitcher}/>
                </CardActions>
            </div>
        </Card>
    );
}
//const Firestore = require('../../../Firebase').Firestore
//
// const useStyles = makeStyles(theme => ({
//   bigAvatar: {
//     marginLeft: 26,
//     width: 150,
//     height: 150,
//     border: '3px solid #41aaa8'
//   }
// }))
//
// export default function RepresentativeImage (props) {
//   const classes = useStyles()
//   const [name, setName] = useState('')
//   const [imageUrl, setImageUrl] = useState('')
//
//   useEffect(() => {
//     const db = new Firestore()
//     db.Politician()
//       .select('name', '==', props.representativeToLoad)
//       .then(snapshot => {
//         if (snapshot.empty) {
//           console.log('No matching documents.')
//           return
//         }
//         snapshot.forEach(doc => {
//           console.log(doc.id, '=>', doc.data())
//           const { name, imageUrl } = doc.data()
//           setName(name)
//           setImageUrl(imageUrl)
//         })
//       })
//       .catch(err => {
//         console.log('Error getting documents', err)
//       })
//   })
//   return <Avatar alt={name} src={imageUrl} className={classes.bigAvatar} />
// }
