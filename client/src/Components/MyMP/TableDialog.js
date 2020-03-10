import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import BillDialog from "../Dashboard/BillDialog";

const useStyles = makeStyles({
    avatar: {
        backgroundColor: '#43D0C4'
    },
    table: {
        minWidth: 650,
        // padding:30
    },
    tableContainer:{
        padding: "0px 40px 0px 20px"
    },
    titles:{
        fontWeight:700
    }
})
export function capitalizedName (sponsor) {
    if (sponsor && isNaN(sponsor)) {
        let name = sponsor
        name = name.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ')
        return name
    }
    return null
}

export default function TableDialog (props) {
    const classes = useStyles()
    const { onClose, selectedValue, open } = props
    const [billInfo, setBillInfo] = React.useState([])
    const [billOpen, setBillOpen] = React.useState(false)

    const handleClose = () => {
        onClose(selectedValue)
    }

    const handleBillClickOpen = (row,type) => {
        if(row && type=='bar-pie'){
            let temp = {
                name: row.bill.billsClassified.number,
                desc:row.bill.billsClassified.title,
                link:row.bill.billsClassified.link,
                sponsor:row.bill.billsClassified.sponsorName,
                date:row.bill.billsClassified.dateVoted
            }
            console.log(temp)
            setBillInfo(temp)
            setBillOpen(true)
        }
        if(row && type=='radar'){
            let temp = {
                name: row.billData.number,
                desc:row.billData.title,
                link:row.billData.link,
                sponsor:row.billData.sponsorName,
                date:row.billData.dateVoted
            }
            console.log(temp)
            setBillInfo(temp)
            setBillOpen(true)
        }
        if(row && type=='bipartisan'){
            let temp = {
                name: row.billDetails.billData.number,
                desc:row.billDetails.billData.title,
                link:row.billDetails.billData.link,
                sponsor:row.billDetails.billData.sponsorName,
                date:row.billDetails.billData.dateVoted
            }
            console.log(temp.date)
            console.log(temp)
            setBillInfo(temp)
            setBillOpen(true)
        }
    }
    const handleBillClose = () => {
        setBillOpen(false)
    }

    return (
        <Dialog onClose={handleClose} open={open} maxWidth={"md"} fullWidth={true}>
            <DialogTitle id='simple-dialog-title' className={classes.titles} >Details: </DialogTitle>
            <TableContainer className={classes.tableContainer}>
                <Table className={classes.table} size='medium' aria-label='simple table'>
                    <TableHead>
                            {!props.type? (
                                <TableRow>
                                    <TableCell className={classes.titles}>Bill Name</TableCell>
                                    <TableCell className={classes.titles} align='right'> Category </TableCell>
                                    <TableCell className={classes.titles} align='right'>Bill Status</TableCell>
                                </TableRow>
                                ):
                                (
                                    props.type=='bipartisan'?
                                            ( <TableRow >
                                                <TableCell className={classes.titles}>Bill Name</TableCell>
                                                <TableCell className={classes.titles} align="right">Category</TableCell>
                                                <TableCell className={classes.titles} align="right">Vote</TableCell>
                                                <TableCell className={classes.titles} align='right'>Political Party</TableCell>
                                            </TableRow>):
                                        <TableRow>
                                            <TableCell  className={classes.titles}>{"Bill Name"}</TableCell>
                                            <TableCell className={classes.titles} align='center'>{"Category"}</TableCell>
                                            <TableCell className={classes.titles} align='right'>{"Vote"}</TableCell>
                                        </TableRow>
                                )}
                    </TableHead>
                    {(props.rows.length) > 0 ? (
                        <TableBody stickyHeader>
                            {props.rows.map((row,i)=> (
                                row.bill ?
                                     (
                                          <TableRow key={i}>
                                            <TableCell component='th' scope='row'>
                                                <Button color='primary' onClick={() => handleBillClickOpen(row,props.type)}>
                                                    <Typography>{row.bill.billsClassified.number}</Typography>
                                                </Button>
                                            </TableCell>
                                            <TableCell component='th' scope='row' align='right'><Typography>{capitalizedName(row.category)}</Typography></TableCell>
                                            <TableCell align='right'><Typography>{capitalizedName(row.status)} </Typography> </TableCell>
                                          </TableRow>
                                        ):(
                                           !row.voteRecord?
                                            <TableRow key={i}>
                                                <TableCell component='th' scope='row'>
                                                    <Button color='primary' onClick={() => handleBillClickOpen(row,props.type)}>
                                                        <Typography>{row.billDetails.billData.number}</Typography>
                                                    </Button>
                                                </TableCell>
                                                <TableCell component='th' scope='row' align="right">
                                                   <Typography>{capitalizedName(row.billDetails.billData.category)}</Typography>
                                                </TableCell>
                                                <TableCell component='th' scope={'row'} align="right">
                                                   <Typography style= {{color:"green"}}>{row.billDetails.voteRecord.yea == true ? "Yea":"Nay"}</Typography>
                                                </TableCell>
                                                <TableCell component='th' scope={'row'} align='right'>
                                                   <Typography>{capitalizedName(row.category)}</Typography>
                                                </TableCell>
                                            </TableRow>:
                                                <TableRow key={i}>
                                                    <TableCell component='th' scope='row'>
                                                        <Button color='primary' onClick={() => handleBillClickOpen(row,'radar')}>
                                                        <Typography>{row.voteRecord.billNumber}</Typography>
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell align='center' component='th' scope='row'>
                                                        <Typography>{capitalizedName(row.billData.category)}</Typography>
                                                    </TableCell>
                                                    <TableCell align='right'>
                                                        <Typography style= {row.voteRecord.yea === true? {color:"green"}: {color: "red"}}>{row.voteRecord.yea == true? "Yea": "Nay"}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                        )

                            ))}
                        </TableBody>) : 'nothing!'}
                </Table>
            </TableContainer>
            <BillDialog billInfo={billInfo} open={billOpen} onClose={handleBillClose} />

        </Dialog>
    )
}