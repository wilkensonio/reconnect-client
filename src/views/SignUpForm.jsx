/**
 * SignupForm component handles the user registration process.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onVerifySignup - Callback function to be called after successful email verification
 * 
 * @returns {JSX.Element} The rendered SignupForm component
 * 
 * @example
 * <SignupForm onVerifySignup={handleVerifySignup} />
 * 
 * @typedef {Object} UserData
 * @property {string} user_id - The user's HootLoot ID
 * @property {string} first_name - The user's first name
 * @property {string} last_name - The user's last name
 * @property {string} email - The user's email address
 * @property {string} password - The user's password
 * @property {string} phone_number - The user's phone number
 * 
 * @typedef {Object} EmailResponse
 * @property {string} verification_code - The verification code sent to the user's email
 * 
 * @typedef {Object} UserResponse
 * @property {string} email - The user's email address
 * @property {number} status - The response status code
 * 
 * @function validateFields
 * @description Validates the form fields to ensure they are not empty
 * @param {Object} fields - The form fields to validate
 * @param {string} fields.userId - The user's HootLoot ID
 * @param {string} fields.firstName - The user's first name
 * @param {string} fields.lastName - The user's last name
 * @param {string} fields.email - The user's email address
 * @param {string} fields.password - The user's password
 * @param {string} fields.phoneNumber - The user's phone number
 * @returns {boolean} True if all fields are valid, otherwise false
 * 
 * @function sendEmailVerification
 * @description Sends an email verification code to the user's email address
 * @returns {Promise<void>} A promise that resolves when the email is sent
 * 
 * @function handleVerifyEmail
 * @description Handles the email verification process and form validation
 * @param {Event} e - The form submission event
 * @returns {Promise<void>} A promise that resolves when the email verification is complete
 * 
 * @function togglePasswordVisibility
 * @description Toggles the visibility of the password field
 * 
 * @function toggleConfirmPasswordVisibility
 * @description Toggles the visibility of the confirm password field
 */
import React, { useState } from 'react';
import { CForm, CCol, CFormInput, CButton, CRow, CInputGroupText, CInputGroup} from '@coreui/react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 
import {sendEmail} from '../apiservice/MailService';
import useFormValidation from '../components/validButton/useFormValidation';
import { getUserByEmail } from '../apiservice/UserService';
 

const SignupForm = ({onVerifySignup}) => { 
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(''); 
  const [sentCode, setSentCode] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);   
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  
  
  
  const validateFields = fiedls => {
    const {userId, firstName, lastName, email, password, phoneNumber} = fiedls;
    return (
      userId.trim() !== '' && 
      firstName.trim() !== '' && 
      lastName.trim() !== '' && 
      email.trim() !== '' && 
      password.trim() !== '' && 
      confirmPassword.trim() !== '' && 
      phoneNumber.trim() !== '' 
    );
  }  

  const isFormValid = useFormValidation(
    {userId, firstName, lastName, email, password, phoneNumber},
    validateFields
  );
 
  // Send the email verification code to the user
  const sendEmailVerification = async () => {
    try {
      setError('');
      const response = await sendEmail(email);  
      console.log(response.verification_code, response);
      
      setSentCode(response.data.verification_code); // The code sent to the user  
    } catch (error) { 
      console.log(error);
      
      setError('Failed to send verification email.');
    }
  } 

  const userData = {
    user_id: userId,
    first_name: firstName,
    last_name: lastName,
    email: email.toLowerCase(),
    password: password,
    phone_number: phoneNumber,
  }; 
 
  
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // check user don't already exist in the database
      const response = await getUserByEmail(email);

      if (response && response.email.toLowerCase() === email.toLowerCase()) {
        setError('User already exists, please sign in.');
        return;
      } 
      
    } catch (error) {
      if (error.detail !== 'User not found') { 
        setError(error.detail); 
        return;
      }
    }
    
      if (userId.trim() === ''              ||
      firstName.trim() === ''       || 
      lastName.trim() === ''        || 
      email.trim() === ''           || 
      password.trim() === ''        ||
      confirmPassword.trim() === '' ||
      phoneNumber.trim() === ''){  
      setError('All fields are required');
      return;
    }
    
    if (!/^\d{8}$/.test(userId)) {
      if (userId.length !== 8) {
        setError('Invalid HootLoot ID must be 8 digits' );
        return;
      } 
    }
    if (firstName.trim() === '') {
      setError('First Name is required');
      return;
    }
    if (lastName.trim() === '') {
      setError('Last Name is required');
      return;
    }
    if (email.trim() === '') {
      setError('Email is required');
      return;
    }
    
    if (!email.toLowerCase().endsWith('@southernct.edu')) {
      setError('Please enter a valid southern email');
      return;
    }
    
    if (password.trim() === '' || confirmPassword.trim() === '') {
      setError('Password is required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      setError('Password must be at least 8 characters long, with at least one uppercase letter and one number');
      return;
    } 
    
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Invalid phone number must be 10 digits or enter 0000000000 if you do not have a phone number');
      return;
    } 

    setError('');
    localStorage.setItem('reconnect_signup_data', JSON.stringify(userData));  

    const emailResponse = await sendEmailVerification(); 
    console.log(emailResponse);

    onVerifySignup();
    
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return ( 
    <div className=""> 
        <span hidden>testSignupForm</span>
        <div className='d-flex justify-content-center align-items-center '> 
              <CRow> 
                <CCol md={12} > 
                    <div className=''>
                        <CForm  className="row gy-2 gx-3 ">
                          <CCol xs={12} className='mb-2'>
                            <CFormInput
                              id="idInput"
                              placeholder="Enter your (HootLoot) ID *"
                              value={userId}
                              onChange={(e) => setUserId(e.target.value)}
                              required
                            />
                          </CCol>
                          <CCol xs={12} className='mb-2'>
                            <CFormInput
                              id="firstNameInput"
                              placeholder="First Name *"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                            />
                          </CCol>
                          <CCol xs={12} className='mb-2'>
                            <CFormInput
                              id="lastNameInput"
                              placeholder="Last Name *"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required
                            />
                          </CCol>
                          <CCol xs={12} className='mb-2'>
                            <CFormInput
                              id="emailInput"
                              type="email"
                              placeholder="johndl1@southernct.edu *"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              />
                          </CCol>
                          <CCol xs={12} className='mb-2'>
                          <CInputGroup>
                            <CFormInput
                              id="passwordInput"
                              type={showPassword ? 'text' : 'password'} // Toggle password visibility
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
                          <CCol xs={12} className='mb-2'>
                            <CInputGroup>
                              <CFormInput
                                id="confirmPasswordInput"
                                type={showConfirmPassword ? 'text' : 'password'} 
                                placeholder="Confirm password *"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                              /> 
                              <CInputGroupText onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>  
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                              </CInputGroupText>
                            </CInputGroup>
                          </CCol>
                          <CCol xs={12} className='mb-2'>
                            <CFormInput
                              id="phoneInput"
                              placeholder="Phone number *"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              required
                            />
                          </CCol>
                          <CCol xs={12} className='mt-3'>
                            <CButton className='ccolor' 
                              type="submit" 
                              disabled={!isFormValid}
                              onClick={handleVerifyEmail}
                            >
                                Next
                            </CButton> 
                          </CCol>
                        </CForm>
                      </div>
                      {error && (
                        <CCol xs={12} className="text-danger pt-3">
                          <p>{error}</p>
                        </CCol>
                      )}
                </CCol>  
              </CRow>  
        </ div> 
      </div> 
  ); 
};

export default SignupForm;
