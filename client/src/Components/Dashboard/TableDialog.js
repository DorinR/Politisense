import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DescriptionIcon from '@material-ui/icons/Description'
import List from '@material-ui/core/List'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import HelpIcon from '@material-ui/icons/Help'
import LinkIcon from '@material-ui/icons/Link'
import PersonIcon from '@material-ui/icons/Person'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import Link from '@material-ui/core/Link'
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import BillDialog from "./BillDialog";

const useStyles = makeStyles({
    avatar: {
        backgroundColor: '#43D0C4'
    },
    table: {
        minWidth: 650,
    },
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

    const handleBillClickOpen = (row) => {
        if(row && row[1]=='bar-pie'){
            let temp = {
                name: row.bill.billsClassified.number,
                desc:row.bill.billsClassified.title,
                link:row.bill.billsClassified.link,
                sponsor:row.bill.billsClassified.sponsorName,
                data:row.bill.billsClassified.dateVoted
            }
            console.log(temp)
            setBillInfo(temp)
            setBillOpen(true)
        }
        if(row && row[1]=='radar'){
            let temp = {
                name: row.billData.number,
                desc:row.billData.title,
                link:row.billData.link,
                sponsor:row.billData.sponsorName,
                data:row.billData.dateVoted
            }
            console.log(temp)
            setBillInfo(temp)
            setBillOpen(true)
        }
    }
    const handleBillClose = () => {
        setBillOpen(false)
    }

    return (
        <Dialog onClose={handleClose} open={open} maxWidth={"lg"}>
            <DialogTitle id='simple-dialog-title'>Bills Issued Details: </DialogTitle>
            <TableContainer className={classes.tableContainer}>
                <Table className={classes.table} size='medium' aria-label='a dense table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Bill Name</TableCell>
                            <TableCell> Category </TableCell>
                            <TableCell align='right'>Bill Status</TableCell>
                        </TableRow>
                    </TableHead>
                    {(props.rows.length) > 0 ? (
                        <TableBody stickyHeader>
                            {props.rows.map((row,i)=> (
                                <TableRow key={i}>
                                    <TableCell component='th' scope='row'>
                                        <Button color='primary' onClick={() => handleBillClickOpen(row)}>
                                            <Typography>{row.bill.billsClassified.number}</Typography>
                                        </Button>
                                    </TableCell>
                                    <TableCell component='th' scope='row'><Typography>{row.category}</Typography></TableCell>
                                    <TableCell align='right'><Typography>{row.status}</Typography></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>) : 'nothing!'}
                </Table>
            </TableContainer>
            <BillDialog billInfo={billInfo} open={billOpen} onClose={handleBillClose} />

        </Dialog>
    )
}