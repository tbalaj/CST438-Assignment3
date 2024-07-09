import React, {useState} from 'react';
import {SERVER_URL} from '../../Constants';

// student views a list of assignments and assignment grades 
// use the URL  /assignments?studentId= &year= &semester=
// The REST api returns a list of SectionDTO objects
// Use a value of studentId=3 for now. Until login is implemented in assignment 7.

// display a table with columns  Course Id, Assignment Title, Assignment DueDate, Score

const AssignmentsStudentView = (props) => {
    
    const studentId = 3;
    const headers = ['Course ID', 'Assignment', 'Due Date', 'Score'];
    const [assignments, setAssignment] = useState ([
        //Test data
        // {courseId: 'cst338', title: 'Markov', dueDate: '2024-7-8', score: 99},
        // {courseId: 'cst338', title: 'RPG Game', dueDate: '2024-7-8', score: 70},
        // {courseId: 'cst370', title: 'Quiz 1', dueDate: '2024-7-8', score: 89},
        // {courseId: 'cst438', title: 'Assignment 1', dueDate: '2024-7-8', score: 79},
        // {courseId: 'cst438', title: 'Quiz 1', dueDate: '2024-7-8', score: 84}
    ])

    const [message, setMessage] = useState('');
    const [search, setSearch] = useState({studentId, year: '', semester: ''});

    const fetchAssignments = async () => {
        let semesters = ['Spring', 'Fall', 'Summer', 'Winter'];
        setMessage('');
        if (search.studentId === '' || search.year === '' || search.semester === '') {
            setMessage("Enter search");
        } else if (!semesters.includes(search.semester)) {
            setMessage("Semester must be Spring, Fall, Summer, or Winter");
        } else if (/^\d+$/.test(search.year) === false) {
            setMessage("Year must be a number");
        } else {
            try {
                const response = await fetch(`${SERVER_URL}/assignments?studentId=${search.studentId}&year=${search.year}&semester=${search.semester}`);
                if (response.ok) {
                    const data = await response.json();
                    setAssignment(data);
                } else {
                    const r = await response.json();
                    setMessage(r.message);
                }
            } catch(err){
                setMessage("Error: " +err);
            }
        }
    }

    const editChange = (event) => {
        setSearch({...search,  [event.target.name]:event.target.value});
    }
     
    return(
        <>
            <div>
                <h3>Assignments</h3>

                <h4>{message}</h4>
                <h4>Enter year and semester for Assignments you wish to retrieve:</h4>

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
                <button type="submit" id="search" onClick={fetchAssignments}>Search for Assignments</button>
                <br/>
                <br/>
                <table className="Center">
                    <thead>
                        <tr>
                            {headers.map((h,idx) => <th key={idx}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((assignment) =>
                            <tr key={assignment.courseId}>
                                <td>{assignment.courseId}</td>
                                <td>{assignment.title}</td>
                                <td>{assignment.dueDate}</td>
                                <td>{assignment.score}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default AssignmentsStudentView;