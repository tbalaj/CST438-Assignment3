import React, {useState, useEffect} from 'react';
import {confirmAlert} from "react-confirm-alert";
import {SERVER_URL} from '../../Constants';
import Button from '@mui/material/Button';


// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments/sections/{secNo}?studentId=3
// studentId=3 will be removed in assignment 7.

const CourseEnroll = (props) => {
     
    const studentId = 3 
    const [message, setMessage] = useState('');
    const headers = ['Section No', 'Semester', 'Course Id', 'Section Id', 'Room', 'Times', 'Instructor', 'Email', ''];
    const [oCourses, setOCourses] = useState([
        // {secNo: 1, year: 2024, semester: "summer", courseId: "cst438", secId: 1, building: "CompSci", room: "111", times: "", instructorName: "joshua gross", instructorEmail: "jgross@csumb.edu"},
        // {secNo: 2, year: 2024, semester: "summer", courseId: "cst370", secId: 2, building: "CompSci", room: "110", times: "", instructorName: "joshua gross", instructorEmail: "jgross@csumb.edu"},
        // {secNo: 3, year: 2024, semester: "summer", courseId: "cst338", secId: 3, building: "Art", room: "101", times: "", instructorName: "joshua gross", instructorEmail: "jgross@csumb.edu"},
        // {secNo: 4, year: 2024, semester: "summer", courseId: "cst329", secId: 4, building: "CompSci", room: "104", times: "", instructorName: "joshua gross", instructorEmail: "jgross@csumb.edu"}
    ]);

    const fetchOpenCourses = async () => {
        try{
            const response = await fetch(`${SERVER_URL}/sections/open`);

            if (response.ok) {
                const data = await response.json();
                setOCourses(data);
            } else {
                const r = await response.json();
                setMessage("Error: "+ r.message);
            }
        } catch(err) {
            setMessage("Error :"+err);
        }
    }
 
    useEffect( () => {
        fetchOpenCourses();
    }, [] );

    const enrollAlert = event => {
        const row_index = event.target.parentNode.parentNode.rowIndex-1;
        const selectedCourse = oCourses[row_index];
        const selectedCourseSecNo = oCourses[row_index].secNo;
        confirmAlert({
            title: 'Confirm to Enroll',
            message: 'Confirm to enroll in Section: ' + selectedCourse.secNo +' '+ selectedCourse.courseId.toUpperCase() +' '+ selectedCourse.semester +'?',
            buttons: [
                {
                    label: 'Enroll',
                    onClick: () => doEnroll(selectedCourseSecNo)
                },
                {
                    label: 'Cancel',
                }
            ]
        })
    }

    const doEnroll = async (selectedCourseSecNo) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments/sections/${selectedCourseSecNo}?studentId=${studentId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setMessage("You have enrolled in Section: " + selectedCourseSecNo /**+" "+ selectedCourse.courseId +" "+ selectedCourse.semester**/)
                fetchOpenCourses();
            } else {
                const r = await response.json();
                setMessage(r.message);
            }

        } catch(err) {
            setMessage("Error: "+err);
        }
     }

    return(
        <>
            <h3>Open Courses</h3>

            <table className="Center">
                <thead>
                    <tr>
                        {headers.map((h,idx) => <th key={idx}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {oCourses.map((oCourse) =>
                        <tr key = {oCourse.secNo}>
                            <td>{oCourse.secNo}</td>
                            <td>{oCourse.semester}</td>
                            <td>{oCourse.courseId}</td>
                            <td>{oCourse.secId}</td>
                            <td>{oCourse.room}</td>
                            <td>{oCourse.times}</td>
                            <td>{oCourse.instructorName}</td>
                            <td>{oCourse.instructorEmail}</td>
                            <td><Button onClick = {enrollAlert}>Enroll</Button></td>
                        </tr>

                    )}

                </tbody>
            </table>

            <h4>{message}</h4>

        </>
    );
}

export default CourseEnroll;
