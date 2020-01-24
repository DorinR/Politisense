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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import HelpIcon from '@material-ui/icons/Help';
import LinkIcon from '@material-ui/icons/Link';
import PersonIcon from '@material-ui/icons/Person';
import {fetchRidingCode,} from "./Sidebar/RepresentativeInfo";
import axios from "axios";
import Box from "@material-ui/core/Box";
import RidingShapeContainer from "./Sidebar/RidingShape/RidingShapeContainer";
import {getAllBillsByHead} from '../Dashboard/HeadToHeadComparison'

const useStyles = makeStyles({
    card: {
        width: 300
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
    const [totalBills,setTotalBills] =useState(0)
    const [ridingCode, setRidingCode] = useState('')

    const updateNameFromSwitcher = (newName) =>{
        setName(newName)
        updateHead(newName)
        console.log('New Name'+newName)
    }

    useEffect(() => {
        if(name){
            async function getRepInfo(name){
                const res = await axios.get(`http://localhost:5000/api/representatives/${name}/getRepresentativesInfo`)
                console.log("im here res.data.data"+ res.data.data)
                return res.data.data
            }
            async function getData (name) {
                // eslint-disable-next-line
                const riding = await getRepInfo(name)
                const bills = await getAllBillsByHead(name)
                let total = await calculateTotalVotesBills(bills)
                setTotalBills(total)
                setRiding(riding.riding)
                let test = riding.riding
                setYearElected(riding.yearElected)
                setPoliticalParty(riding.politicalParty)
                const ridingCode = await fetchRidingCode(test)
                setRidingCode(ridingCode)
            }
            getData(name)

        }

    },[name,riding,politicalParty,yearElected])

    return (
        <Card className={classes.card} >
            <div className='contents' style={gridStyle}>
                <ListItemAvatar >
                    <RepresentativeImage representativeToLoad={name} />
                </ListItemAvatar>
                <CardContent>
                    <List>
                        <ListItem >
                            <ListItemAvatar>
                                <Avatar className={classes.avatar}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText >{name}</ListItemText>
                        </ListItem>
                        <ListItem >
                            <ListItemAvatar>
                                <Avatar className={classes.avatar}>
                                    <HelpIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText >{politicalParty}</ListItemText>
                        </ListItem>
                        <ListItem >
                            <ListItemAvatar>
                                <Avatar className={classes.avatar}>
                                    <LinkIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText >
                                {riding}
                            </ListItemText>
                        </ListItem>

                        <ListItem >
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText >Elected in {yearElected}</ListItemText>
                    </ListItem>
                        <ListItem >
                            <ListItemAvatar>
                                <Avatar className={classes.avatar}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText > Total Voted Bills: {totalBills}</ListItemText>
                        </ListItem>
                        <ListItem >
                            <Box m={1} />
                            <RidingShapeContainer
                                ridingCode={ridingCode}
                                politicalParty={politicalParty}
                            />
                            <Box m={1} />
                        </ListItem>
                    </List>
                </CardContent>
                <CardActions>
                    <MpsSwitcher functionUpdate={updateNameFromSwitcher}/>
                </CardActions>
            </div>
        </Card>
    );
}
async function calculateTotalVotesBills(bills){
    let totalBills=0
    if(bills){
        bills.forEach(bill=>totalBills++)
    }
    return totalBills
}