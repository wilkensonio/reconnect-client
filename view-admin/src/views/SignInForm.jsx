import React, { useState } from 'react';
import axios from 'axios';
import { CButton, CRow, CCol, CForm, CFormInput, CFormLabel } from '@coreui/react';

function SignInForm() {
  //Creates the objects for the inputs 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();  

    if (!email.endsWith('@southernct.edu')) {
      setError('Please a valid Southern email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

     // Validate password for at least one capital letter and one number
    if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
      setError('Password must contain at least one uppercase letter and one number');
      return;
    }
  
    try {
      const response = await axios.post('/api/signin/', {
        email: email,
        password: password,
      }); 

      const {first_name, last_name, access_token, token_type} = response.data;
      
      setFirstName(first_name); 
      setLastName(last_name);

      localStorage.setItem('reconnect_access_token', access_token);
      localStorage.setItem('reconnect_token_type', token_type);

      // clear the form 
      setEmail('');
      setPassword('');
      
      window.location.href = '/dashboard';

    } catch (error)  {
      if (error.response) {
        setError(error.response.data.detail || "An error occurred");
      } else {
        console.log(error);
        
        setError('Error connecting to the server.');
      }
    }
  };

  return (
    <CRow className="justify-content-center align-items-center" style={{ height: '100vh' }}>
      <p className='h1 d-flex justify-content-center mt-5'>Sign In</p>
      <CCol md={6} className="text-start mt-5">  
        <CForm onSubmit={handleSubmit} className="row gy-2 gx-3 m-3">
          <CCol xs={12}>
            <CFormLabel htmlFor="emailInput">Email</CFormLabel>
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
            <CFormLabel htmlFor="passwordInput">Password</CFormLabel>
            <CFormInput
              id="passwordInput"
              type="password"
              placeholder="*****************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </CCol>
          <CCol xs={12}>
            <CButton color="primary" type="submit">Sign In</CButton>
            <div className="mt-5 d-flex justify-content-center mb-3">
              <a href="/signup" className="text-decoration-none">Don't have an account? Sign Up</a>
            </div>
          </CCol>
           
          {firstName && lastName && (
            <div>
              <h5>Welcome, {firstName} {lastName}!</h5>
            </div>
          )}
          {error && (
            <div className="text-danger">
              <p>{error}</p>
            </div>
          )}
        </CForm>
      </CCol>
    </CRow>
  );
};

export default SignInForm;
