import React, { useState } from 'react';
import { CButton, CFormInput, CFormLabel, CContainer, CRow, CCol, CTooltip } from '@coreui/react';
import { addStudent, uploadCsv } from '../ApiService/StudentService';  
import customTooltipStyle from '../components/tooltip/CustomToolTip';
import { Link } from 'react-router-dom';

function NewStudent() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [csvFile, setCsvFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // student_id is the HootLoot ID, must be a string and all digits
    const studentData = {
      student_id: studentId,
      first_name: firstName,
      last_name: lastName,
      email: email.toLocaleLowerCase(),
      phone_number: phoneNumber || '0000000000', 
    }; 
    
    if (!/^\d+$/.test(studentId)) {
      setError('Student ID must contain only digits');
      return;
    }

    if (!email.toLocaleLowerCase().endsWith('@southernct.edu')) {
      setError('Please enter a valid southern email');
      return;
    }

    try {
      const response = await addStudent(studentData);
      if (response.status === 400){
        setError(response.data.detail);
        return;
      }
      if (response.status === 409){
        setError('Student already exists');
        return;
      } 
      if (response.status === 422) { 
        setError('Invalid student data');
        return;
      }
      console.log('Student added:', response);  
      setFirstName('');
      setLastName('');
      setEmail('');
      setStudentId('');
      setPhoneNumber(''); 
      setSuccess('Student added successfully');
      setError(''); 
    } catch (error) {
      setScuccess('');  
      console.error('Error adding student:', error);
      setError('Failed to add student'); 
    }
  
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();

    try {
      setSuccess('');
      setError('');
      if (!csvFile) {
        setError('Select a CSV file');
        return;
      }
      await uploadCsv(csvFile);
      setSuccess('CSV file uploaded successfully');
      setCsvFile(null);
    } catch (error) {
      console.error('Error uploading CSV file:', error);
      setError('Failed to upload CSV file');
    }
  };

  return (
    <div className='container'>
      <h2 className='text-center text-white mt-3'>Upload or Add New Students</h2>
      <div className='mb-5 mt-4'>
        <Link to='/dashboard'>
            <span className='text-white'>Back to dashboard</span>
        </Link>
      </div>
      <CContainer className='d-flex justify-content-center   w-100'> 
        <div className='card shadow '>
          <h3  className='text-center  d-flex justify-content-center mt-3 mb-5'> 
              <>      
              Students
                <CTooltip 
                    style={customTooltipStyle}
                    content={
                        <div>
                            <p className='text-start mb-1'> <span className='text-danger'>
                                * </span>Upload students via csv or add a student.</p>
                            <p className='text-start mb-1'> <span className='text-danger'>
                                1.</span>CSV must have student_id , first_name, last_name and scsu email.</p>
                            <p className='text-start mb-1'> <span className='text-danger'>
                                2.</span>Phone number is not required to add student.</p>
                            <p className='text-start mb-1'> <span className='text-danger'>
                                3.</span>Once students are added they can be seen in the student dashboard.</p>
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

          <CRow className='m-3'> 
            <CCol md={5}>
                {/* <h3 className="text-center">Upload Students CSV</h3> */}
                <form onSubmit={handleCsvUpload}>
                  <CFormLabel>Select CSV File</CFormLabel>
                  <CFormInput 
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files[0])}
                    required
                  />
                  <CButton type="submit" className="mt-3 ccolor">
                    Upload CSV
                  </CButton>
                </form>
              </CCol>

              {/* Vertical Divider */}
              <CCol md={1} className="d-flex flex-column align-items-center justify-content-center">
              
              <div className='mt-2' style={{ borderLeft: '2px solid #007bff', height: '50%' }} />
              <div className="mx-2 d-flex align-items-center justify-content-center">Or</div>
              <div className='mb-2' style={{ borderLeft: '2px solid #007bff', height: '45%' }} />
            
              </CCol>

              <CCol md={6}>
                <form onSubmit={handleSubmit}> 
                  <CFormInput
                    className='mt-4' 
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder='Student ID (HootLoot ID) *'
                    required
                  />
                  <CFormInput
                    className='mt-4' 
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder='First Name *'
                    required
                  /> 
                  
                  <CFormInput
                    className='mt-4' 
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder='Last Name *'
                    required 
                  />  
                  
                  <CFormInput
                    className='mt-4' 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email@southernct.edu *'
                    required
                  />
                
                  <CFormInput
                    className='mt-4' 
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder='Phone Number' 
                  />

                  <CButton type="submit" className="mt-4 ccolor">
                    Add Student
                  </CButton>
                </form>
                <div className='mt-5'>
                  <Link to='/dashboard'>
                          Back to dashboard
                  </Link>
                </div>
              </CCol> 
          </CRow>
          { success && <p className='text-center mt-3 text-success'>{success}</p>}
          { error && <p className='text-center mt-3 text-danger'>{error}</p>}
        </div>
      </CContainer>
    </div>

  );
}


export default NewStudent;
