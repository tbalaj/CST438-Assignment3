import React, { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from '@mui/material/Button';
import { SERVER_URL } from '../../Constants';

const CourseEnroll = (props) => {
    const [sections, setSections] = useState([]);
    const [message, setMessage] = useState('');

    const getJwtToken = () => sessionStorage.getItem('jwt'); // or localStorage.getItem('jwtToken')

    const fetchSections = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/open`, {
                headers: {
                    'Authorization': getJwtToken() // Include JWT in header
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSections(data);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error " + err);
        }
    }

    useEffect(() => {
        fetchSections();
    }, []);

    const addSection = async (secNo) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments/sections/${secNo}?studentId=3`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getJwtToken() // Include JWT in header
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMessage("Section added. Enrollment ID=" + data.enrollmentId);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error " + err);
        }
    }

    const onAdd = (e) => {
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        const secNo = sections[row_idx].secNo;
        confirmAlert({
            title: 'Confirm to add',
            message: 'Do you really want to add?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => addSection(secNo)
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    const headers = ['Section No', 'Year', 'Semester', 'Course Id', 'Section', 'Title', 'Building', 'Room', 'Times', 'Instructor', ''];

    return (
        <div>
            <h4>{message}</h4>
            <h3>Open Sections Available for Enrollment</h3>
            <table className="Center">
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {sections.map((s) => (
                    <tr key={s.secNo}>
                        <td>{s.secNo}</td>
                        <td>{s.year}</td>
                        <td>{s.semester}</td> {/* Changed from courseId to semester */}
                        <td>{s.courseId}</td>
                        <td>{s.secId}</td>
                        <td>{s.title}</td>
                        <td>{s.building}</td>
                        <td>{s.room}</td>
                        <td>{s.times}</td>
                        <td>{s.instructorName}</td>
                        <td><Button onClick={onAdd}>Add Course</Button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CourseEnroll;
