import React, { useEffect } from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'

export const getDescription = async (ministry) => {
    return axios
        .post('api/parliament/getRoleDescription', { ministry: ministry })
        .then(res => {
            let desc = ''
            if (res.data.success) {
                desc = res.data.data.description
            }
            return desc
        }).catch(console.error)
}
export default function MinisterHelpDialog (props) {
  const { onClose, open } = props
  const [text, setText] = React.useState('')


  useEffect(() => {
    setText('')
    async function getData () {
      const desc = await getDescription(props.ministry)
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
          {text ||
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '70%',
              transform: 'translate(-50%, -50%)'
            }}
            >
              <CircularProgress />
            </div>}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
