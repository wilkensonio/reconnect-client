import { useState, useEffect } from 'react'
import { CButton, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react'
import { fetchStudents, fakeStudents } from '../api/StudentService'

function Students() {
    const [students, setStudents] = useState([])
    const [studentLength, setStudentLength] = useState(0)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [studentToDelete, setStudentToDelete] = useState(null)
    const [filteredStudents, setFilteredStudents] = useState(students) 
     
    useEffect(() => {
        const fetchStudentData = async () => { 
            const data = await fetchStudents();  
            setStudentLength(data.length);
            setStudents(data.length <=0 ? fakeStudents() : data);
        };

        fetchStudentData();

    }, [studentLength]);

    useEffect(() => {
        setFilteredStudents(students)
    }, [students]) 
  

    const filterStudents = (searchTerm) => {
        const filtered = students.filter((student) =>
            student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.student_id.includes(searchTerm)
        )
        setFilteredStudents(filtered)
    }

    const handleDeleteStudent = async () => {
        await deleteStudent(studentToDelete.id);
        setStudents(students.filter(student => student.id !== studentToDelete.id));
        setFilteredStudents(students.filter(student => student.id !== studentToDelete.id));
        setShowDeleteModal(false);
    }; 

    const openDeleteModal = (student) => {
        setStudentToDelete(student)
        setShowDeleteModal(true)
    }

    return (
        <div>
            <h3 className='text-center'>Students</h3>
            <div className="container">
                <div>
                    <input
                        type="text"
                        placeholder="Search for a student"
                        onChange={(e) => filterStudents(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="row">
                    {filteredStudents.map((student) => (
                        <div className="col-md-4" key={student.id}>
                            <div className="card card-student mt-2">
                                <div className="card-body">
                                    <p>{student.student_id}  {student.email}</p> 
                                    <p>{student.first_name}  {student.last_name}</p> 
                                    <CButton
                                        className='me-2 mt-2'
                                        color="danger"
                                        onClick={() => openDeleteModal(student)}
                                    >
                                        Delete
                                    </CButton>
                                    <CButton
                                        className='me-2 mt-2'
                                        color="info"
                                        onClick={() => scheduleMeeting(student.id)}
                                    >
                                        Schedule meeting
                                    </CButton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> 
                
            </div>

            {/* Modal to confirm delete action */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader>Confirm Delete</CModalHeader>
                <CModalBody>
                    Are you sure you want to delete {studentToDelete?.firstName} {studentToDelete?.lastName}?
                </CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={handleDeleteStudent}>Confirm</CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default Students
