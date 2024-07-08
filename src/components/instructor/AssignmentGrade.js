import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../Constants';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TableContainer, TextField, TableBody, TableCell, TableHead, Table, Paper, TableRow
} from '@mui/material';

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignment/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score' 
// score column is an input field 
//  <input type="text" name="score" value={g.score} onChange={onChange} />


const AssignmentGrade = ({ assignment }) => {
    const [assignments, setAssignments] = useState([]);
    const [open, setOpen] = useState(false);


    // Fetch assignments from the backend
    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments/${assignment.id}/grades`);
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
            } else {
                console.error('Failed to fetch assignments:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };
    useEffect(() => {

        fetchAssignments();
    }, []);
    // Handle the form submission
    const handleUpdate = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/grades`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assignments)
            });
            if (response.ok) {
                console.log('Assignment updated successfully');
            } else {
                console.error('Failed to update assignment');
            }
        } catch (error) {
            console.error('Error updating assignment:', error);
        }
        fetchAssignments();
    };
    const toggle = () => {
        setOpen(open => !open);
        // setAssignment(assignment);
    }
    const handleEdit = (event, enrollment) => {
        setAssignments(a => a.map(enr => {
            if (event.target.name === enrollment.studentEmail) {
                return { ...enr, score: event.target.value };
            }
            return enrollment;
        }))
    }

    return (
        <div>
            <Button id="editAssignment" onClick={toggle}>Grade</Button>
            <Dialog open={open} >
                <DialogTitle>Edit Grades</DialogTitle>
                <DialogContent style={{ paddingTop: 20 }} >
                    <TableContainer >
                        <Table >
                            <TableBody>
                                {
                                    assignments.map(enrollment => {
                                        return (
                                            <TableRow key={enrollment.studentEmail}>
                                                <TableCell>{enrollment.studentEmail}</TableCell>
                                                <TableCell>{enrollment.dueDate}</TableCell>
                                                <TableCell>
                                                    <TextField id="edueDate" style={{ padding: 10 }} label="score" name={enrollment.studentEmail} 
                                                    value={enrollment.score ?? ''}
                                                        onChange={e => handleEdit(e, enrollment)} />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button id="close" color="secondary" onClick={toggle}>Close</Button>
                    <Button id="save" color="primary" onClick={handleUpdate}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AssignmentGrade;