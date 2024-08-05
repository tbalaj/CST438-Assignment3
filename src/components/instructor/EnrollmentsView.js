import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import { SERVER_URL } from '../../Constants';

const EnrollmentsView = (props) => {
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');

    const location = useLocation();
    const { secNo, courseId, secId } = location.state;

    const getJwtToken = () => localStorage.getItem('jwtToken'); // or sessionStorage.getItem('jwtToken');

    const fetchEnrollments = useCallback(async () => {
        if (!secNo) return;
        try {
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/enrollments`, {
                headers: {
                    'Authorization': `Bearer ${getJwtToken()}` // Include JWT in header
                }
            });
            if (response.ok) {
                const data = await response.json();
                setEnrollments(data);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }, [secNo]);

    useEffect(() => {
        fetchEnrollments();
    }, [fetchEnrollments]);

    const saveGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getJwtToken()}` // Include JWT in header
                },
                body: JSON.stringify(enrollments),
            });
            if (response.ok) {
                setMessage("Grades saved");
                fetchEnrollments();
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }

    const onGradeChange = (e) => {
        const copy_enrollments = enrollments.map((x) => x);
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        copy_enrollments[row_idx] = { ...(copy_enrollments[row_idx]), grade: e.target.value };
        setEnrollments(copy_enrollments);
    }

    const headers = ['enrollment id', 'student id', 'name', 'email', 'grade'];

    return (
        <>
            <h3>{message}</h3>

            {enrollments.length > 0 &&
                <>
                    <h3>{courseId}-{secId} Enrollments</h3>

                    <table className="Center">
                        <thead>
                        <tr>
                            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                        {enrollments.map((e) => (
                            <tr key={e.enrollmentId}>
                                <td>{e.enrollmentId}</td>
                                <td>{e.studentId}</td>
                                <td>{e.name}</td>
                                <td>{e.email}</td>
                                <td><input type="text" name="grade" value={(e.grade) ? e.grade : ''} onChange={onGradeChange} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Button onClick={saveGrades}>Save Grades</Button>
                </>
            }
        </>
    );
}

export default EnrollmentsView;
