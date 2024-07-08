import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';


// instructor views a list of sections they are teaching 
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:  
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

const InstructorSectionsView = () => {
    const [sections, setSections] = useState([]);
    const location = useLocation();
    const email = 'dwisneski@csumb.edu';
    const { year, semester } = location.state;
    const headers = ['SecNo', 'CourseId', 'SecId', 'Year', 'Semester', 'Building', 'Room', 'Times', '', ''];

    const fetchSections = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections?email=${email}&year=${year}&semester=${semester}`);
            if (response.ok) {
                const courses = await response.json();
                setSections(courses);
            } else {
                const json = await response.json();
            }
        } catch (err) {
        }
    }

    useEffect(() => {
        fetchSections();
    }, []);
    return (
        <>
            <h3>Sections Overview</h3>
            <Button variant="outlined" onClick={fetchSections} style={{ marginBottom: '20px' }}>Refresh Data</Button>

            <table className="Center" >
                <thead>
                    <tr>
                        {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {sections.map((s) => (
                        <tr key={s.secNo}>
                            <td>{s.secNo}</td>
                            <td>{s.courseId}</td>
                            <td>{s.secId}</td>
                            <td>{s.year}</td>
                            <td>{s.semester}</td>
                            <td>{s.building}</td>
                            <td>{s.room}</td>
                            <td>{s.times}</td>
                            <td><Button variant="contained" color="primary">
                                <Link to="/enrollments" state={s} style={{ textDecoration: 'none', color: 'inherit' }}>View Enrollments</Link>
                            </Button>
                            </td>
                            <td><Button variant="contained" color="primary">
                                <Link to="/assignments" state={s} style={{ textDecoration: 'none', color: 'inherit' }}>View Assignments</Link>
                            </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </>
    );
}

export default InstructorSectionsView;

