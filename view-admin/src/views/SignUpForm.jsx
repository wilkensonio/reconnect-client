import React, { useState } from 'react';
import { CForm, CCol, CFormInput, CFormLabel, CButton, CRow, CCard, CCardBody } from '@coreui/react';
import axios from 'axios';

const SignupForm = () => {
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing error messages

     // Validate HootLoot ID
     if (!/^\d{8}$/.test(userId)) {
      setError('Invalid HootLoot ID' );
      return;
    }

    // Validate email
    if (!email.endsWith('@southernct.edu')) {
      setError('Please enter a valid email ending with @southernct.edu');
      return;
    }
    else if (!email.includes(lastName.toLowerCase())) {
      setError('Please enter a valid email with your last name');
      return;
    }

    else if (!email.includes(firstName[0].toLowerCase())) {
      setError('Please add the first letter of your first name after your last name'); 
      return; 
    }

    else if (!/^\D*(\d\D*){1,2}$/.test(email)) {
      setError('Email must have at least one or two digits');
      return;
    }

  

    // Validate password length and complexity
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      setError('Password must be at least 8 characters long, with at least one uppercase letter and one number');
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Invalid phone number');
      return;
    }

    const userData = {
      user_id: userId,
      first_name: firstName,
      last_name: lastName, 
      email: email,
      password: password,
      phone_number: phoneNumber,
    };
    console.log(userData);
    
    try {
      const response = await axios.post('/api/signup/', userData);
      
      // Clear the form
      setUserId('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');

      const res = response.data
      console.log(res);
       
      window.location.href = '/signin';
      
    } catch (error) { 
        // Optionally, handle specific error responses here
        if (error.response) {
           setError(error.response.data.detail || 'Signup failed');
        }
      
    };
  };  

  return (
  <CCard className="position-absolute top-50 start-50 translate-middle shadow" style={{maxWidth: '35rem', width: '90%'}}>
    <CCardBody>
      <CRow>
        <p className='h1 d-flex justify-content-center mt-5'>Sign Up</p>
        <CCol md={12} >
            <CForm onSubmit={handleSubmit} className="row gy-2 gx-3 m-3">
              <CCol xs={12}>
                <CFormLabel htmlFor="idInput"></CFormLabel>
                <CFormInput
                  userId="idInput"
                  placeholder="Enter your ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="firstNameInput"></CFormLabel>
                <CFormInput
                  id="firstNameInput"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="lastNameInput"></CFormLabel>
                <CFormInput
                  id="lastNameInput"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="emailInput"></CFormLabel>
                <CFormInput
                  id="emailInput"
                  type="email"
                  placeholder="youremail@southernct.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="passwordInput"></CFormLabel>
                <CFormInput
                  id="passwordInput"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="phoneInput"></CFormLabel>
                <CFormInput
                  id="phoneInput"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </CCol>
              <CCol xs={12} className='pb-3'>
                <CButton color="primary" type="submit" style={{position: 'relative', top:'20px'}}>Sign Up</CButton>
              </CCol>
              {error && (
                <CCol xs={12} className="text-danger">
                  <p>{error}</p>
                </CCol>
              )}
            </CForm>
        </CCol>  
      </CRow>
    </CCardBody>
  </CCard>
  );
};

export default SignupForm;
