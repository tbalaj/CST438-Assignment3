import React, {useState} from 'react';
import {SERVER_URL} from '../../Constants';
import { confirmAlert } from 'react-confirm-alert';
import Button from '@mui/material/Button';

// student can view schedule of sections 
// use the URL /enrollment?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollment/{enrollmentId}

const ScheduleView = (props) => {
    
    const headers = ['EnrollmentId', 'CourseId', 'SecId',  'Year', 'Semester', 'Building', 'Room', 'Times', '', ''];

    const [search, setSearch] = useState({
        year: '',
        semester: ''
    });
    const [message, setMessage] = useState('');
    const [schedules, setSchedules] = useState([
        // {enrollmentId: "1", courseId: "cst338", sectionId: "1", year: "2024", semester: "Fall", building: "Science", room: "110", times: "11:00am-1:00pm"},
        // {enrollmentId: "1", courseId: "cst338", sectionId: "1", year: "2024", semester: "Fall", building: "Science", room: "110", times: "11:00am-1:00pm"},
        // {enrollmentId: "1", courseId: "cst338", sectionId: "1", year: "2024", semester: "Summer", building: "Science", room: "110", times: "11:00am-1:00pm"},
        // {enrollmentId: "1", courseId: "cst338", sectionId: "1", year: "2024", semester: "Summer", building: "Science", room: "110", times: "11:00am-1:00pm"}
    ]);

    const fetchSections = async () => {
            let semesters = ['Spring', 'Fall', 'Summer', 'Winter'];
            setMessage('');
            if (search.year === '' || search.semester === '') {
              setMessage("Search schedule");
            } else if (!semesters.includes(search.semester)) {
              setMessage("Must be Spring, Fall, Summer, or Winter");
            } else if (/^\d+$/.test(search.year) === false) {
              setMessage("Invalid Year");
            } else {
              try {
                const response = await fetch(`${SERVER_URL}/enrollments?studentId=3&year=${search.year}&semester=${search.semester}`);
                console.log('Fetching data from URL:', `${SERVER_URL}/enrollments?studentId=3&year=${search.year}&semester=${search.semester}`);
                console.log('Fetch response status:', response.status);

                if (response.ok) {
                  const data = await response.json();
                  setSchedules(data);
                } else {
                  const r = await response.json();
                  setMessage(r.message);
                }
              } catch(err) {
                setMessage("Error: " + err);
              }
            }
        }

        const deleteSchedule = async (enrollmentId) => {
            try {
              const response = await fetch (`${SERVER_URL}/enrollments/${enrollmentId}`,
              {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              if (response.ok) {
                setMessage("Schedule deleted");
                fetchSections();
              } else {
                const r = await response.json();
                setMessage(r.message);
              }
            } catch (err) {
              setMessage("Error: " + err);
            }
          }

          const editChange = (event) => {
            setSearch({...search,  [event.target.name]:event.target.value});
        }

        const onDelete = (SecNo) => {
          confirmAlert({
              title: 'Confirm!',
              message: 'Delete?',
              buttons: [
                {
                  label: 'Yes',
                  onClick: () => deleteSchedule(SecNo)
                },
                {
                  label: 'No',
                }
              ]
            });
        }
   
    return(
        < > 
              <div>
                  <h3>Schedule</h3>

                  <h4>{message}</h4>
                  <h4>Enter year, semester.  Ex. Year/Semester(2024/Fall)</h4>
                  <table className="Center">
                      <tbody>
                        <tr>
                          <td>Year:</td>
                          <td><input type="text" id="year_id" name="year" value={search.year} onChange={editChange} /></td>
                        </tr>
                        <tr>
                          <td>Semester:</td>
                          <td><input type="text" id="semester_id" name="semester" value={search.semester} onChange={editChange} /></td>
                        </tr>
                      </tbody>
                  </table>
                  <br/>
                  <button type="submit" id="search" onClick={fetchSections}>Search for Schedule(s)</button>
                  <br/>
                  <br/>
                  <table className="Center" >
                      <thead>
                      <tr>
                          {headers.map((schedule, idx) => (<th key={idx}>{schedule}</th>))}
                      </tr>
                      </thead>
                      <tbody>
                      {schedules.map((schedule) => (
                              <tr key={schedule.enrollmentId}>
                              <td>{schedule.enrollmentId}</td>
                              <td>{schedule.courseId}</td>
                              <td>{schedule.sectionId}</td>
                              <td>{schedule.year}</td>
                              <td>{schedule.semester}</td>
                              <td>{schedule.building}</td>
                              <td>{schedule.room}</td>
                              <td>{schedule.times}</td>
                              <td><Button onClick={() => onDelete(schedule.enrollmentId)}> Drop Class</Button></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
        </ >
    );

}

export default ScheduleView;