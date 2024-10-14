import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CButton, CRow, CCol, CForm, 
  CFormInput, CFormLabel, CCard, CCardBody  
} from '@coreui/react';
import { useLocation } from 'react-router-dom';
import qs from 'qs';

function SignInForm() {
  //Creates the objects for the inputs 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();

  const apiKey = import.meta.env.VITE_APP_API_KEY;
 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');

    if (success == 'account_created') {
      setMessage('Account created successfully. Please sign in.');
    }
    setEmail('');
    setPassword('');
  }, [location]); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();  

    if (!email.endsWith('@southernct.edu')) {
      setError('Enter a valid southern email');
      return;
    } 

    try {
      
      const token = await axios.post('/api/token',
        qs.stringify({username:email, password}),{ 
          Headers: {
            'R-API-KEY': `${apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
      });
      
      const {access_token, token_type} = token.data;
      
      localStorage.setItem('reconnect_access_token', access_token);
      localStorage.setItem('reconnect_token_type', token_type); 
      
      const response = await axios.post('/api/signin/', {email, password},{
        headers: {
          'R-API-KEY': `${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      const {first_name, last_name} = response.data;
      setFirstName(first_name);
      setLastName(last_name);

      setEmail('');
      setPassword('');
      
      if (response.status === 200 && token.status === 200) {
        window.location.href = '/dashboard';
      } 
      
    } catch (error) {
      if (error.response) 
        setError(error.response.data.detail || 'An error occurred');
      else  
        setError('Error connecting to the server.'); 
    }     
  };

  return (
   
      <div className='d-flex justify-content-center align-items-center shadow '
        style={{ height: '100vh'}}>
        <CCard  
          style={{
            background: '#e9e9e9',
            maxWidth: '35%', width: '90%', 
            transition: 'filter 0.3s', 
          }}>
          <CCardBody>
            <CRow> 
              <p className='h3 d-flex justify-content-center mt-2'>Sign In</p>
              <CCol className="mx-auto" >  
                <CForm onSubmit={handleSubmit} className="row">
                  <CCol xs={12}>
                    <CFormLabel htmlFor="emailInput"></CFormLabel>
                    <CFormInput
                      id="emailInput"
                      type="email"
                      placeholder="email@southernct.edu"
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
                  <CCol xs={12} className='mt-3'>
                    <CButton color="primary" type="submit" style={{position: 'relative', top:'10px'}}>Sign In</CButton>
                    <div className="mt-5 d-flex justify-content-center mb-3">
                    Don't have an account?&nbsp;<a href="/signup" className="text-decoration-none">Sign Up</a>
                    </div>
                  </CCol>
                  
                  {firstName && lastName && (
                    <div>
                      <h5>Welcome, {firstName} {lastName}!</h5>
                    </div>
                  )}
                  {error && (
                    <div className="text-danger text-center">
                      <p>{error}</p>
                    </div>
                  )}
                </CForm>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </div>

  );
};

export default SignInForm;
