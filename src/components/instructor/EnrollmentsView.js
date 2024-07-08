import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';


// instructor view list of students enrolled in a section 
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

const EnrollmentsView = () => {
    const [enrollments, setEnrollments] = useState([]);
    const location = useLocation();
    const { secNo, courseId, secId } = location.state;

    const fetchEnrolements = async () => {
        try {
            const url = `${SERVER_URL}/sections/${secNo}/enrollments`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setEnrollments(data);
            } else {
                const json = await response.json();
            }
        } catch (err) {

        }
    }

    useEffect(() => {
        fetchEnrolements();
    }, []);

    const handleGradeChange = (index, newGrade) => {
        const updatedEnrollments = enrollments.map((enrollment, i) => {
            if (i === index) {
                return { ...enrollment, grade: newGrade };
            }
            return enrollment;
        });
        setEnrollments(updatedEnrollments);
    };
    const submit = async (enrollment) => {
        try {
            const response = await fetch (`${SERVER_URL}/enrollments`, 
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              }, 
              body: JSON.stringify([enrollment])
            });
           
          } catch (err) {
          }
    }
    return (
        <>
            <h3>Enrollments Overview</h3>
            <Button variant="outlined" onClick={fetchEnrolements} style={{ marginBottom: '20px' }}>Refresh Entrolments</Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Enrollment ID</TableCell>
                            <TableCell>Student ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Grade</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {enrollments.map((enrollment, index) => (
                            <TableRow key={index}>
                                <TableCell>{enrollment.id}</TableCell>
                                <TableCell>{enrollment.studentId}</TableCell>
                                <TableCell>{enrollment.name}</TableCell>
                                <TableCell>{enrollment.email}</TableCell>
                                <TableCell>
                                    <TextField
                                        type="text"
                                        value={enrollment.grade}
                                        onChange={(e) => handleGradeChange(index, e.target.value)}
                                        variant="outlined"
                                        size="small"
                                    /><Button onClick={()=> submit(enrollment)}> update </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </>
    );
}

export default EnrollmentsView;
