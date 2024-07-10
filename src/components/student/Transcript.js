import React from 'react';

// students gets a list of all courses taken and grades
// use the URL /transcript?studentId=
// the REST api returns a list of EnrollmentDTO objects 
// the table should have columns for 
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = (props) => {
    const [transcript, setTranscript] = useState([]);
    const studentId = new URLSearchParams(window.location.search).get('studentId');

    useEffect(() => {
        const fetchTranscript = async () => {
            try {
                const response = await axios.get(`/transcript?studentId=${studentId}`);
                setTranscript(response.data);
            } catch (error) {
                console.error("Error fetching transcript data:", error);
            }
        };

        if (studentId) {
            fetchTranscript();
        }
    }, [studentId]);

    return (
        <>
            <h3>Transcript</h3>
            <table>
                <thead>
                <tr>
                    <th>Year</th>
                    <th>Semester</th>
                    <th>CourseId</th>
                    <th>SectionId</th>
                    <th>Title</th>
                    <th>Credits</th>
                    <th>Grade</th>
                </tr>
                </thead>
                <tbody>
                {transcript.map((enrollment, index) => (
                    <tr key={index}>
                        <td>{enrollment.year}</td>
                        <td>{enrollment.semester}</td>
                        <td>{enrollment.courseId}</td>
                        <td>{enrollment.sectionId}</td>
                        <td>{enrollment.title}</td>
                        <td>{enrollment.credits}</td>
                        <td>{enrollment.grade}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default Transcript;