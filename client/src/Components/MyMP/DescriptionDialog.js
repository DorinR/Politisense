import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Timeline, TimelineItem }  from 'vertical-timeline-component-for-react';

const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))

(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} >
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit,
    },
}))(MuiDialogActions);

 const DescriptionDialog = (props)=> {
    const { onClose, selectedValue, open } = props

    const handleClose = () => {
        console.log(props.data)
        onClose(selectedValue)
    };
        return (
            <div>
                <Dialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                        {props.explaination? props.explaination.title: props.title}
                    </DialogTitle>

                    {props.d3 ?
                        <DialogContent>
                            <Typography gutterBottom>
                                {props.explaination.title? props.explaination.body: "modal title"}
                            </Typography>
                        </DialogContent>
                        :
                        <DialogContent>
                            <Timeline lineColor={'#ddd'}>
                                {props.data ? props.data.map((element,i) =>(

                                    <TimelineItem
                                        key={i}
                                        dateText= {loadingTextdata(element)}
                                        dateInnerStyle={{ background: '#61b8ff', color: '#000' }}
                                        bodyContainerStyle={{
                                            background: '#ddd',
                                            padding: '20px',
                                            borderRadius: '8px',
                                            boxShadow: '0.5rem 0.5rem 2rem 0 rgba(0, 0, 0, 0.2)',
                                        }}
                                    >
                                        <h3 style={{ color: '#61b8ff' }}>{ loadingTextTitle(element)}</h3>
                                        <p>
                                            Est incididunt sint eu minim dolore mollit velit velit commodo ex nulla
                                            exercitation. Veniam velit adipisicing anim excepteur nostrud magna
                                            nostrud aliqua dolor. Sunt aute est duis ut nulla officia irure
                                            reprehenderit laborum fugiat dolore in elit. Adipisicing do qui duis Lorem
                                            est.
                                        </p>
                                        <p>
                                            Est incididunt sint eu minim dolore mollit velit velit commodo ex nulla
                                            exercitation. Veniam velit adipisicing anim excepteur nostrud magna
                                            nostrud aliqua dolor. Sunt aute est duis ut nulla officia irure
                                            reprehenderit laborum fugiat dolore in elit. Adipisicing do qui duis Lorem
                                            est.
                                        </p>
                                    </TimelineItem>

                                )): ''}
                            </Timeline>
                        </DialogContent>


                    }

                </Dialog>
            </div>
        );
    }
 export function loadingTextdata(element){
    if(element.fromDate == 0 && element.toDate == 0){
        return 'Present'
    }
    if(element.fromDate !== 0 && (element.toDate == 0)){
        return `${element.fromDate} - Present`
    }
    if(element.fromDate !== 0 && (element.toDate !== 0)){
        return `${element.fromDate} - ${element.toDate}`
    }}

export function loadingTextTitle(element){
     let title= null
   switch(element.type){
       case "parliamentary":
           title= element.title
           break
       case "association":
           title =  element.group
           let n = title.indexOf("parliamentary")
           title = title.slice(0,n)

           break
       case "committee":
           title= element.group
           break
       default:
           title = ""
           break
   }
   return title
}


export default DescriptionDialog;