import { useState, useEffect } from 'react'
import { CButton, CModal,CModalBody, CModalFooter, CTooltip } from '@coreui/react'
import { fetchStudents, blacklistStudent} from '../ApiService/StudentService'
import customTooltipStyle from '../components/tooltip/CustomToolTip'
// Function to generate fake student data remove after 
const generateFakeStudents = (count) => {
    const fakeStudent = [];
    for (let i = 1; i <= count; i++) {
        const student_id = (7857890 + i).toString().padStart(8, '0'); 
        fakeStudent.push({
            id: `fake-${i}`,
            student_id: student_id,
            first_name: `FakeFirst${i}`,
            last_name: `FakeLast${i}`,
            email: `fake${i}@southernct.edu`,
        });
    }
    return fakeStudent;
};

function Students() {
    const count = 10;
    const [students, setStudents] = useState([])
    const [studentLength, setStudentLength] = useState(0) 
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [studentToDelete, setStudentToDelete] = useState(null)
    const [filteredStudents, setFilteredStudents] = useState(students)  
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: count });

    useEffect(() => {
        const fetchStudentData = async () => { 
            const data = await fetchStudents();  
            setStudentLength(data.length);
            const fakeStudents = generateFakeStudents(100);
            setStudents([...data, ...fakeStudents]); // Merge real and fake students remove fake students aftera after testing
        };

        fetchStudentData();

    }, [studentLength]);


    useEffect(() => {
        setFilteredStudents(students)
    }, [students]) 
  
    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        console.log(scrollTop, windowHeight, documentHeight);
        


        if (scrollTop + windowHeight >= documentHeight - 200) {
            setVisibleRange((prevRange) => ({
                start: prevRange.start,
                end: Math.min(prevRange.end + count, students.length), // Increase the visible range end
            }));
        } 
         
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [students, visibleRange]);

    const filterStudents = (searchTerm) => {
        const filtered = students.filter((student) =>
            student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.student_id.includes(searchTerm)
        )
        setFilteredStudents(filtered)
        setVisibleRange({ start: 0, end: count });
    }

    const handleDeleteStudent = async () => {
        await blacklistStudent(studentToDelete.student_id);
        setStudents(students.filter(student => student.id !== studentToDelete.id));
        setFilteredStudents(students.filter(student => student.id !== studentToDelete.id));
        setShowDeleteModal(false);
    }; 

    const openDeleteModal = (student) => {
        setStudentToDelete(student)
        setShowDeleteModal(true)
    }

    const currentStudents = filteredStudents.slice(visibleRange.start, visibleRange.end);
  
    return (
        <div>
            <h3 className='text-center text-white  d-flex justify-content-center mt-3 mb-5'>
                <>      
                    Students
                    <CTooltip 
                        style={customTooltipStyle}
                        content={
                            <div>
                                <p className='text-start mb-1'> <span className='text-danger'>
                                    1.</span> This page displays a list of all students.</p>
                                <p className='text-start mb-1'> <span className='text-danger'>
                                    2.</span> You can search for a student by name, email or student ID.</p>
                                <p className='text-start mb-1'> <span className='text-danger'>
                                    3.</span> You can delete a student from the list by clicking the delete button.</p>
                                <p className='text-start mb-1'> <span className='text-danger'>
                                    4.</span> Deleting a student will blacklist the student from the system.</p>
                            </div>
                        }
                            placement="bottom"
                             
                            >
                        <span className="border border-primary bg-tooltip rounded-circle text-white d-flex justify-content-center align-items-center"
                            style={{ cursor: 'pointer', color: '#007bff', 
                            marginLeft: '10px', width:'2rem', 
                            height: '2rem', paddingTop:'.2rem' }}>
                            ?
                        </span>
                    </CTooltip>
                </>
            </h3>
            <div className="container">
                <div className='mb-3'>
                    <input
                        type="text"
                        placeholder="Search for a student by name, email or student ID"
                        onChange={(e) => filterStudents(e.target.value)}
                        className="form-control"
                    />
                </div>                 

                <div className="row">
                {currentStudents.map((student) => (
                        <div sm={12} className="col-sm-12" key={student.id}>
                            <div className="card card-student mt-2">
                                <div className="p-2 card-body d-flex align-items-center justify-content-between">
                                    <div className='d-flex align-items-center w-100' style={{ overflow: 'hidden' }}>
                                        <p className="m-0 text-truncate" style={{ flex: '0 0 100px'}}>
                                            {student.student_id} 
                                        </p>
                                        <p className="m-0 text-truncate" style={{ flex: '0 0 200px'}}> 
                                            {student.email} 
                                        </p>
                                        <p className="m-0 ms-4 text-truncate" style={{ flex: '0 0 250px'}}>
                                            {student.first_name} {student.last_name} 
                                        </p> 
                                    </div>
                                    <div className='d-flex jsutify-content-center align-items-center'>
                                         
                                        <CButton
                                        className='me-2 pt-0 pb-0   m-0' 
                                            color="danger"
                                            onClick={() => openDeleteModal(student)}
                                        >
                                            Delete
                                        </CButton>
                                        <CButton
                                        className='m-0  pt-0 pb-0 ccolor' 
                                            onClick={() => scheduleMeeting(student.id)}
                                        >
                                            Schedule
                                        </CButton> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>  
            </div>

            {/* Modal to confirm delete action */}
            <CModal className="border-0" visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
              
                <CModalBody className="border-0">
                    {studentToDelete ? (
                        <>
                            Are you sure you want to delete this student ? <br/>
                            <hr />
                            <p>Studen ID: {studentToDelete?.student_id}</p>
                            <p>Email : {studentToDelete.email}</p>
                            <p>
                              Name:  {studentToDelete.first_name} {studentToDelete.last_name}
                            </p> 
                        </>
                    ) : (
                        <>Loading student information...</>  
                    )}
                </CModalBody>
                <CModalFooter className="border-0">
                    <CButton color="danger" onClick={handleDeleteStudent}>Confirm</CButton>
                </CModalFooter>
            </CModal>
        </div>
    )  
}

export default Students
