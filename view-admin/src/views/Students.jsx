import { useState, useEffect } from 'react'
import { CButton, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react'
import { fetchStudents, fakeStudents } from '../ApiService/StudentService'

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
            <h3 className='text-center text-white'>Students</h3>
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
                    {filteredStudents.map((student) => (
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
