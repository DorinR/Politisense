import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";
import {ConfirmationDialogRaw} from "./CategoryForm";

export default function DeleteCategoryDialog(props) {
    const { onClose, open,index,value: valueProp,...other } = props
    const [value, setValue] = React.useState(false)
    React.useEffect(() => {
        if (!open) {
            setValue(false);
        }
    }, [value, open]);

    const handleCancel = ()=>{
        onClose(false,props.index)
    }

    const handleYes = ()=>{
        onClose(true,props.index)
    }
    return (
        <div>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove it ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        No
                    </Button>
                    <Button onClick={handleYes} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

ConfirmationDialogRaw.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.bool.isRequired,
};