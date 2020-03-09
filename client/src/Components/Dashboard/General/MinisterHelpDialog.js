
import React, { useEffect } from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import axios from "axios";
import {getMinisters, getPartyInfo} from "./GeneralDashboard";


export default function MinisterHelpDialog (props) {
  const { onClose, open } = props
  const [text, setText] = React.useState('')

  async function getDescription () {
    let desc = []
    await axios
        .post('http://localhost:5000/api/parliament/getRoleDescription',{'ministry':props.ministry})
        .then(res => {
          if (res.data.success) {
            console.log(res)
          }
        })
        .catch(err => console.error(err))
    return desc
  }

  useEffect(() => {
    let desc = ''
    async function getData () {
      desc = await getDescription()
      setText(desc)
    }
    getData()
  }, [props.ministry])

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog onClose={handleClose} open={open} TransitionComponent={props.transition}>
      <DialogTitle>Role of the minister</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
