import React, { useEffect, useState } from 'react';
import { CButton, CRow, CCol, CForm, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react';
import { useLocation } from 'react-router-dom';
import {signinUser} from '../apiservice/SignService';
import {getToken} from '../apiservice/TokenService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 
import useFormValidation from '../components/validButton/useFormValidation';
 

/**
 * SignInForm component handles the user sign-in process.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onResetPassword - Callback function to handle password reset
 * 
 * @returns {JSX.Element} The rendered SignInForm component
 * 
 * @example
 * <SignInForm onResetPassword={handleResetPassword} />
 * 
 * @description
 * The SignInForm component renders a form for user sign-in. It includes fields for email and password,
 * and provides validation to ensure the email is a valid Southern Connecticut State University email.
 * It also handles various messages based on URL parameters, such as session expiration or account creation.
 * 
 * @function
 * @name SignInForm
 * 
 * @param {Object} fields - The fields to validate
 * @param {string} fields.email - The email field
 * @param {string} fields.password - The password field
 * 
 * @returns {boolean} - Returns true if the fields are valid, otherwise false
 * 
 * @example
 * validateFields({ email: 'johnd1@southernct.edu', password: 'password123' });
 * 
 * @description
 * The validateFields function checks if the email and password fields are not empty and if the email
 * ends with '@southernct.edu'.
 * 
 * @function
 * @name validateFields
 * 
 * @param {Object} e - The event object
 * 
 * @returns {void}
 * 
 * @example
 * handleSubmit(event);
 * 
 * @description
 * The handleSubmit function handles the form submission. It validates the email and password,
 * attempts to get a token, and then signs in the user. If successful, it redirects to the dashboard.
 * 
 * @function
 * @name handleSubmit
 * 
 * @param {void}
 * 
 * @returns {void}
 * 
 * @example
 * handleResetPasswordClick();
 * 
 * @description
 * The handleResetPasswordClick function triggers the onResetPassword callback.
 * 
 * @function
 * @name handleResetPasswordClick
 * 
 * @param {void}
 * 
 * @returns {void}
 * 
 * @example
 * togglePasswordVisibility();
 * 
 * @description
 * The togglePasswordVisibility function toggles the visibility of the password field.
 * 
 * @function
 * @name togglePasswordVisibility
 */ 
function SignInForm({onResetPassword}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();  
  const [showPassword, setShowPassword] = useState(false); 
 

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
    const token = localStorage.getItem('reconnect_token_expired');
    const params = new URLSearchParams(location.search);
    const smg = params.get('message');
    console.log(token);
    
    if (token && (smg == 'session-expired' || smg == 'token-expired'|| smg == 'session_expired')) {
      setMessage('Session expired. Please sign in.'); 

    }else if (smg == 'account_created') { 
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
        window.location.href = '/faculty/dashboard';
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
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
 

  return (
    <div style={{ width: '100%' }}>
      <span hidden>testSignInForm</span>
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
              <CInputGroup>
                <CFormInput
                  id="passwordInput"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password *"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <CInputGroupText onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </CInputGroupText>
              </CInputGroup>
            </CCol>
            <CCol xs={12} className='mt-3'>
              <CButton className='ccolor' type="submit" 
                style={{position: 'relative', top:'10px'}}
                disabled={!isFormValid}
              > Signin
              </CButton> 
              <div className="mt-5 d-flex justify-content-center mb-3"> 
                <a
                  href="#"
                  className="text-decoration-none"
                  onClick={(e) => {
                    e.preventDefault();  
                    handleResetPasswordClick();
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Reset password
                </a>
              </div>

            </CCol> 
            {error ? (
              <div className="text-danger text-center pt-5">
                <p>{error}</p>
              </div>
            ) :  <div className="text-success text-center pt-5 h5"> {message} </div>}
          </CForm>
        </CCol>
      </CRow> 
    </div>
  ); 
};

export default SignInForm;
