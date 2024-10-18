import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { 
  CButton, CRow, CCol, CForm, 
  CFormInput, CFormLabel, CCard, CCardBody,  
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormCheck,
  
} from '@coreui/react';
import { useLocation } from 'react-router-dom';
import qs from 'qs';
 

function SignInForm({onResetPassword}) {
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
      
      setEmail('');
      setPassword('');
      
      const {first_name, last_name} = response.data;
      setFirstName(first_name);
      setLastName(last_name);

      
      if (response.status === 200 && token.status === 200) {
        window.location.href = '/dashboard';
        localStorage.setItem('reconnect_first_name', first_name);
        localStorage.setItem('reconnect_last_name', last_name);
      } 
      
    } catch (error) {
      if (error.response) 
        setError(error.response.data.detail || 'An error occurred');
      else  
        setError('Error connecting to the server.'); 
    }     
  };

  const handleResetPasswordClick = () => {
    onResetPassword();  
  }; 
 

  return (
    <div style={{ width: '100%' }}>
      <CRow>  
        <CCol>  
          <CForm onSubmit={handleSubmit} className='mb-5' >
            <CCol xs={12} className='mb-4'>
              <CFormInput
                id="emailInput"
                type="email"
                placeholder="johnd1@southernct.edu *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </CCol>
            <CCol xs={12} className='mb-4'>
              <CFormInput
                id="passwordInput"
                type="password"
                placeholder="Password *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </CCol>
            <CCol xs={12} className='mt-3'>
              <CButton className='ccolor' type="submit" style={{position: 'relative', top:'10px'}}>Signn</CButton>
              <div className="mt-5 d-flex justify-content-center mb-3"> 
                <a as button className="text-decoration-none" onClick={handleResetPasswordClick} style={{cursor: 'pointer'}}>Reset password</a>
              </div>
            </CCol> 
            {error && (
              <div className="text-danger text-center">
                <p>{error}</p>
              </div>
            )}
          </CForm>
        </CCol>
      </CRow> 
    </div>
  ); 
};

export default SignInForm;
