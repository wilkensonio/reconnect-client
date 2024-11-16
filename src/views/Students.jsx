import React, { useState, useEffect } from 'react'
import { CButton, CModal,CModalBody, CModalFooter, CModalHeader, CSpinner, CTooltip } from '@coreui/react'
import { fetchStudents, deleteStudent} from '../apiservice/StudentService'
import customTooltipStyle from '../components/tooltip/CustomToolTip'
import { Link } from 'react-router-dom'; 

/**
 * Students component displays a list of students with functionalities to search, filter, and delete students.
 * 
 * @component
 * 
 * @returns {JSX.Element} The Students component.
 * 
 * @example
 * return (
 *   <Students />
 * )
 * 
 * @description
 * - Fetches student data from the server and displays it in a list.
 * - Allows searching for students by name, email, or student ID.
 * - Supports infinite scrolling to load more students as the user scrolls down.
 * - Provides a modal to confirm the deletion of a student.
 * 
 * @function
 * @name Students
 * 
 * @property {number} count - The number of students to display initially and incrementally.
 * @property {Array} students - The list of students fetched from the server.
 * @property {number} studentLength - The total number of students.
 * @property {boolean} showDeleteModal - State to control the visibility of the delete confirmation modal.
 * @property {Object|null} studentToDelete - The student object to be deleted.
 * @property {Array} filteredStudents - The list of students filtered based on the search term.
 * @property {Object} visibleRange - The range of students currently visible in the list.
 * @property {boolean} loading - State to indicate if the data is being loaded.
 * @property {string} error - Error message if any error occurs during data fetching or deletion.
 * 
 * @function fetchStudentData - Fetches the student data from the server.
 * @function handleScroll - Handles the scroll event to implement infinite scrolling.
 * @function filterStudents - Filters the students based on the search term.
 * @function handleDeleteStudent - Deletes the selected student from the server and updates the list.
 * @function openDeleteModal - Opens the delete confirmation modal for the selected student.
 * 
 * @returns {JSX.Element} The rendered component.
 */
function Students() {
    const count = 999999999;
    const [students, setStudents] = useState([])
    const [studentLength, setStudentLength] = useState(0) 
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [studentToDelete, setStudentToDelete] = useState(null)
    const [filteredStudents, setFilteredStudents] = useState(students)  
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: count }); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  

    useEffect(() => {
        const fetchStudentData = async () => {  
            setError('');
            try {
                const data = await fetchStudents();  
                setStudentLength(data.length);
                setStudents([...data]);   
            } catch (error) {
                setError('Could not fetch students'); 
            } finally {
                setLoading(false);
            } 
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

        if (scrollTop + windowHeight >= documentHeight - 200) {
            setVisibleRange((prevRange) => ({
                start: prevRange.start,
                end: Math.min(prevRange.end + count, students.length), 
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
        setError('');
        try{
            await deleteStudent(studentToDelete.student_id);
            setStudents(students.filter(student => student.id !== studentToDelete.id));
            setFilteredStudents(students.filter(student => student.id !== studentToDelete.id));
            setShowDeleteModal(false);
        }catch(e){ 
            setError('Could not delete student') 
        } finally {
            setLoading(false);
        }
    }; 

    const openDeleteModal = (student) => {
        setStudentToDelete(student)
        setShowDeleteModal(true)
    }

    const currentStudents = filteredStudents.slice(visibleRange.start, visibleRange.end);
    const numberOfStudents = filteredStudents.length;
    return (
        <div style={{ height: '90vh', overflow: 'hidden' }} className='scroll-container'>
            <span hidden>testStudents</span>
            <h3 className='text-center text-white  d-flex justify-content-center mt-3 mb-2'>
                <>      
                    <span>{numberOfStudents}&nbsp;</span> Students
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
                                    4.</span> Deleting a student will remove the student from the system.</p>
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
            <div className='mb-5 container'>
                <Link to='/dashboard'>
                    <span className='text-white'>Back to dashboard</span>
                </Link>
            </div>
            {studentLength === 0  ? (
                <div className="d-flex justify-content-center text-white">
                     No students found 
                </div>
            ):(
                <div className="container">
                    <div className='mb-3'>
                        <input
                            type="text"
                            placeholder="Search for a student by name, email or student ID"
                            onChange={(e) => filterStudents(e.target.value)}
                            className="form-control"
                        />
                    </div>                 

                    <div className="row mb-5" style={{ height: '65vh', overflowY: 'scroll'}}>
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
                                            <CButton hidden
                                            className='m-0  pt-0 pb-0 ccolor' 
                                                onClick={() => scheduleMeeting(student.id)}
                                            >
                                                Add&nbsp;Notes
                                            </CButton> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>  
                </div>
            ) } 
            {/* Modal to confirm delete action */}
            <CModal className="border-0" visible={showDeleteModal} 
            onClose={() => setShowDeleteModal(false)}>
                <CModalHeader className="border-0">
                    <span>Are you sure you want to delete this student ?</span>
                </CModalHeader> 
                <CModalBody className="border-0">
                    {studentToDelete ? (
                        <>  
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
