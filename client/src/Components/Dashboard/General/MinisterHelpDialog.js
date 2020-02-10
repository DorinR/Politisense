
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import {fetchRepresentative, fetchUserRiding} from "../../Navbar";

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});



export default function MinisterHelpDialog(props) {
    const classes = useStyles();
    const { onClose, open } = props;
    const [text,setText] = React.useState('')

    const getHelpText = () => {
        setText(props.minister)
    };

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        getHelpText()
    }, [])

    return (
        <Dialog onClose={handleClose}  open={open}  TransitionComponent={props.transition}>
            <DialogTitle >What does this minister do?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {text}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}
