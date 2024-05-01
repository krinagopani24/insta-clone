import { Alert } from '@mui/material'
import Snackbar from '@mui/material/Snackbar';
import React from 'react'

const SnackBar = ({open,color,message,handleClose }) => {
  return (
    <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{  vertical: 'top', horizontal: 'right' }}style={{ marginTop: '50px' }}
          >
            <Alert
              onClose={handleClose}
              severity={color}
              sx={{ width: "100%" }}
            >
              {message}
            </Alert>
          </Snackbar>
  )
}

export default SnackBar