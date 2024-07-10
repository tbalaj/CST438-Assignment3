import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState } from 'react';
import { SERVER_URL } from '../../Constants';

// complete the code.  
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

const AssignmentAdd = ({ refresh }) => {
    const [open, setOpen] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ title: '', dueDate: '', secNo: '' });

    // Toggle the dialog open/closed
    const toggle = () => {
        setOpen(prevOpen => !prevOpen);
        if (open) {
            setNewAssignment({ title: '', dueDate: '', secNo: '' }); // Reset form
        }
    };

    // Handle changes to the input fields
    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewAssignment(prev => ({ ...prev, [name]: value }));
    };

    // Add new assignment
    const handleAdd = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAssignment) // Ensure this includes 'secNo'
            });

            if (response.ok) {
                console.log('Assignment added successfully');
                if (typeof refresh === 'function') {
                    refresh(); // Refresh the assignment list
                } else {
                    console.error('Refresh is not a function');
                }
                toggle(); // Close the dialog
            } else {
                const errorText = await response.text();
                console.error('Failed to add assignment:', errorText);
            }
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    return (
        <>
            <Button onClick={toggle} variant="contained" color="primary">
                Add Assignment
            </Button>
            <Dialog open={open} onClose={toggle}>
                <DialogTitle>Add Assignment</DialogTitle>
                <DialogContent>
                    <TextField
                        id="title"
                        fullWidth
                        label="Title"
                        name="title"
                        value={newAssignment.title}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        id="dueDate"
                        fullWidth
                        label="Due Date (YYYY-MM-DD)"
                        name="dueDate"
                        value={newAssignment.dueDate}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        id="secNo"
                        fullWidth
                        label="Section Number"
                        name="secNo"
                        value={newAssignment.secNo}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggle} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AssignmentAdd;
