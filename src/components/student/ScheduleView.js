import React, {useState} from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';

const ScheduleView = (props) => {
    
    // student views their class schedule for a given term

    const [term, setTerm] = useState( {year:'', semester:''  })
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');

   
    const fetchEnrollments = async () => {
             try {
            const response = await fetch(`${SERVER_URL}/enrollments?studentId=3&year=${term.year}&semester=${term.semester}`);
            if (response.ok) {
                const data = await response.json();
                setEnrollments(data);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error "+err);
        }
    }

    const dropCourse = async (enrollmentId) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments/${enrollmentId}`,
                {
                    method: 'DELETE',
                });
            if (response.ok) {
                setMessage("course dropped");
                fetchEnrollments();
            } else {
                const rc = await response.json();
                setMessage("course drop failed "+rc.message);
            }
        } catch (err) {
            setMessage("network error "+err);
        }
    }

    const onDelete = (e) => {
      const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
      const enrollmentId = enrollments[row_idx].enrollmentId;
      confirmAlert({
          title: 'Confirm to drop',
          message: 'Do you really want to drop this course?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => dropCourse(enrollmentId)
            },
            {
              label: 'No',
            }
          ]
        });
    }

    const onChange = (event) => {
        setTerm({...term, [event.target.name]:event.target.value});
    }


    const headings = ["enrollmentId", "secNo", "courseId", "secId", "building", "room", "times",  ""];

    return(
        <div> 
            <h3>Enter year and semester</h3>
            <h4>{message}</h4>
            <table className="Center">
                <tbody>
                    <tr>
                        <td>Year</td>
                        <td><input type="text" name="year" id="year" value={term.year} onChange={onChange} /></td>
                    </tr>
                    <tr>
                        <td>Semester</td>
                        <td><input type="text" name="semester" id="semester" value={term.semester} onChange={onChange} /></td>
                    </tr>
                </tbody>
            </table>
            
            <button type="submit" onClick={fetchEnrollments}>Get Schedule</button>
            <br/> 
            <br/>
            <table className="Center">
                <thead>
                    <tr>
                       { headings.map( (h, idx) => <th key={idx}>{h}</th>) }
                    </tr>
                </thead>
                <tbody>
                { enrollments.map( (s) => 
                    <tr key={s.enrollmentId}>
                        <td>{s.enrollmentId}</td>
                        <td>{s.sectionNo}</td>
                        <td>{s.courseId}</td>
                        <td>{s.sectionId}</td>
                        <td>{s.building}</td>
                        <td>{s.room}</td>
                        <td>{s.times}</td>
                        <td><Button onClick={onDelete}>Drop</Button></td>
                    </tr>
                 )}
                </tbody>
            </table>
           
        </div>
    );

}

export default ScheduleView;