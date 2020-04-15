import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { formattingCategory } from './Utilities/CommonUsedFunctions'

export function ConfirmationDialogRaw (props) {
  const { onClose, value: valueProp, open, ...other } = props
  const [value, setValue] = React.useState(valueProp)
  const radioGroupRef = React.useRef(null)
  const [categoryList, setCategoryList] = React.useState(null)

  React.useEffect(() => {
    if (props.allcategories) {
      setCategoryList(props.allcategories)
    }
  }, [props])

  React.useEffect(() => {
    const removalExistedCategoriesFromOptions = (existedCategories) => {
      setOptions(categoryList.filter((el) => !existedCategories.includes(el)))
    }
    if (!open) {
      setValue(valueProp)
    }
    if (categoryList) {
      removalExistedCategoriesFromOptions(props.existedcategories)
    }
  }, [valueProp, open, props.existedcategories, categoryList])

  const [options, setOptions] = React.useState(null)

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus()
    }
  }

  const handleCancel = () => {
    onClose()
  }

  const handleOk = () => {
    onClose(value)
  }

  const handleChange = event => {
    setValue(event.target.value)
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth='xs'
      onEntering={handleEntering}
      aria-labelledby='confirmation-dialog-title'
      open={open}
      {...other}
    >
      <DialogTitle id='confirmation-dialog-title'>Select Category</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label='category'
          name='cateogory'
          value={value}
          onChange={handleChange}
        >
          {options ? options.map(option => (
            <FormControlLabel value={option} key={option} control={<Radio />} label={formattingCategory(option)} />
          )) : ''}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleOk} color='primary'>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}
