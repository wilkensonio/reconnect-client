import React, { useEffect, useState } from 'react';
import { CButton, CRow, CCol, CForm, CFormInput } from '@coreui/react';
import { useLocation } from 'react-router-dom';
import {signinUser} from '../ApiService/SignService';
import {getToken} from '../ApiService/TokenService';
import useFormValidation from '../components/validButton/useFormValidation';

function SignInForm({onResetPassword}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();  

  const validateFields = (fields) => {
    const {email, password} = fields;
    return (
      email.trim() !== '' &&
      email.toLocaleLowerCase().endsWith
      ('@southernct.edu') &&
      password.trim() !== ''
    );
  };


  const isFormValid = useFormValidation(
    {email, password},
    validateFields
  );


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const smg = params.get('message');

    if (smg == 'account_created') { 
      setMessage('Account created successfully. Please sign in.');
    }
    else if (smg == 'password_reset') { 
      setMessage('Password reset successfully. Please sign in.');
    } else {
      setMessage('');
    }

    setEmail('');
    setPassword('');
    setError(''); 

  }, [location]); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();  

    if (!email.endsWith('@southernct.edu')) {
      setError('Enter a valid southern email');
      return;
    } 

    try {
      setError('');
      await getToken(email, password); 
    } catch (error) {
      setError('Invalid email or password');
      return;
    }

    try { 
      setError('');
      const response = await signinUser(email, password);  
      
      setEmail('');
      setPassword('');

      const {first_name, last_name} = response.data;

      setFirstName(first_name);
      setLastName(last_name); 
      
      if (response.status === 200) {
        window.location.href = '/dashboard';
        localStorage.setItem('reconnect_first_name', first_name);
      } 
      
    } catch (error) {  
      if (error.response) 
        setError(error.response.data.detail || 'An error occurred');
      else  
        setError('An error occurred while signing in'); 
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
              <CButton className='ccolor' type="submit" 
                style={{position: 'relative', top:'10px'}}
                disabled={!isFormValid}
              > Signin
              </CButton>
              <div className="mt-5 d-flex justify-content-center mb-3"> 
                <a as button className="text-decoration-none" onClick={handleResetPasswordClick} style={{cursor: 'pointer'}}>Reset password</a>
              </div>
            </CCol> 
            {error ? (
              <div className="text-danger text-center pt-5">
                <p>{error}</p>
              </div>
            ) :  <div className="text-success text-center pt-5"> {message} </div>}
          </CForm>
        </CCol>
      </CRow> 
    </div>
  ); 
};

export default SignInForm;
