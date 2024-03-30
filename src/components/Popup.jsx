import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
const Popup = ({ open, setOpen, minutes, seconds }) => {
    return (
        <>
            {open ?
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <DialogContent sx={{ backgroundColor: "var(--bg-color)", color: "var(--txt-color)" }}>
                        <DialogContentText sx={{ color: "var(--txt-color)" }}>
                            Completed in {minutes} minutes {seconds} seconds
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ display: "flex", justifyContent: "center", backgroundColor: "var(--bg-color)" }}>
                        <button style={{ backgroundColor: "var(--numberpad-color)", color: "var(--mnumberpad-txt-color)", padding: "5px", border: "none" }} onClick={() => window.location.reload()} autoFocus>
                            Start new game
                        </button>
                    </DialogActions>
                </Dialog>
                : null}
        </>
    )
}

export default Popup