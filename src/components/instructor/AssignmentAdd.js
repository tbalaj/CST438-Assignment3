import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const AssignmentAdd = (props) => {

    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [assignment, setAssignment] = useState({ title: '', dueDate: '' });

    /*
     *  dialog for add assignment
     */
    const editOpen = () => {
        setOpen(true);
        setEditMessage('');
        setAssignment({ title: '', dueDate: '' });
    };

    const editClose = () => {
        setOpen(false);
        setAssignment({ title: '', dueDate: '' });
        setEditMessage('');
    };

    const editChange = (event) => {
        setAssignment({ ...assignment, [event.target.name]: event.target.value })
    }

    const onSave = () => {
        props.save(assignment);
        editClose();
    }

    return (
        <>
            <Button id='addAssignment' onClick={editOpen}>Add Assignment</Button>
            <Dialog open={open} >
                <DialogTitle>Add Assignment</DialogTitle>
                <DialogContent style={{ paddingTop: 20 }} >
                    <h4>{editMessage}</h4>
                    <TextField id='assignTitle' style={{ padding: 10 }} autoFocus fullWidth label="title" name="title" value={assignment.title} onChange={editChange} />
                    <TextField id='assignDueDate' style={{ padding: 10 }} fullWidth label="dueDate" name="dueDate" value={assignment.dueDate} onChange={editChange} />
                </DialogContent>
                <DialogActions>
                    <Button id="close" color="secondary" onClick={editClose}>Close</Button>
                    <Button id="save" color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AssignmentAdd;
