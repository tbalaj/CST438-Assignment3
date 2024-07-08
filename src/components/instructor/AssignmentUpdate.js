import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState } from 'react';
import { SERVER_URL } from '../../Constants';

//  instructor updates assignment title, dueDate 
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

const AssignmentUpdate = ({ assignment, refresh }) => {
  const [open, setOpen] = useState(false);
  const [assign, setAssignment] = useState(assignment);


  // Handle the form submission
  const handleUpdate = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/assignments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assign)
      });
      if (response.ok) {
        console.log('Assignment updated successfully');
      } else {
        console.error('Failed to update assignment');
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
    refresh();
    toggle()
  };
  const toggle = () => {
    setOpen(open => !open);
    setAssignment(assignment);
  }
  const editChange = (event) => {
    setAssignment({ ...assign, [event.target.name]: event.target.value })
  }
  return (
    <div>
      <Button id="editAssignment" onClick={toggle}>Edit</Button>
      <Dialog open={open} >
        <DialogTitle>Edit Assignment</DialogTitle>
        <DialogContent style={{ paddingTop: 20 }} >
          <TextField id="etitle" style={{ padding: 10 }} fullWidth label="title" name="title" value={assign.title} onChange={editChange} />
          <TextField id="edueDate" style={{ padding: 10 }} fullWidth label="dueDate" name="dueDate" value={assign.dueDate} onChange={editChange} />

        </DialogContent>
        <DialogActions>
          <Button id="close" color="secondary" onClick={toggle}>Close</Button>
          <Button id="save" color="primary" onClick={handleUpdate}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssignmentUpdate;