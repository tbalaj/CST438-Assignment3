import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { SERVER_URL } from '../../Constants';
import { useHistory } from 'react-router-dom';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';
import AssignmentAdd from './AssignmentAdd';


// instructor views assignments for their section
// use location to get the section value 
// 
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns 
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const AssignmentsView = () => {

    const location = useLocation();
    const { secNo, courseId, secId } = location.state;
    const [assignments, setAssignments] = useState([]);

    // Fetch assignments from the backend
    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`);
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

  
    const handleDelete = (assignmentId) => {
        console.log('Deleting assignment:', assignmentId);
    };

    return (
        <>
        <h3>Assignments for Section {secNo}</h3>
        <AssignmentAdd/>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Assignment ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {assignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                            <TableCell>{assignment.id}</TableCell>
                            <TableCell>{assignment.title}</TableCell>
                            <TableCell>{assignment.dueDate}</TableCell>
                            <TableCell>
                                <AssignmentGrade assignment={assignment} refresh={fetchAssignments}/>
                                <AssignmentUpdate assignment={assignment} refresh={fetchAssignments}/>
                                <Button onClick={() => handleDelete(assignment.id)} color="secondary">Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
    );
}

export default AssignmentsView;
