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
    email: email.toLocaleLowerCase(),
    password: password,
    phone_number: phoneNumber,
  }; 

  
  
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError('');
    
    // check user don't already exist in the database
    const userExist = await getUserByEmail(email);
    if (userExist.status === 200) {
      setError('User already exists, please ign in.');
      return;
    }
    setError(''); 
    
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
      setError('Invalid HootLoot ID must be 8 digits' );
      return;
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
    
    if (!email.toLocaleLowerCase().endsWith('@southernct.edu')) {
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
    await sendEmailVerification(); 

    onVerifySignup();
    
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');  

  //   if (!/^\d{8}$/.test(userId)) {
  //     setError('Invalid HootLoot ID' );
  //     return;
  //   } 
    
  //   if (!email.toLocaleLowerCase().endsWith('@southernct.edu')) {
  //     setError('Please enter a valid email ending with @southernct.edu');
  //     return;
  //   }  
   
  //   if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
  //     setError('Password must be at least 8 characters long, with at least one uppercase letter and one number');
  //     return;
  //   }

  //   if (!/^\d{10}$/.test(phoneNumber)) {
  //     setError('Invalid phone number');
  //     return;
  //   }
   
  //   await sendEmailVerification(); 
  // };  
  // onSubmit={handleSubmit}
  
  return ( 
    <div className=""> 
        <div className='d-flex justify-content-center align-items-center '> 
              <CRow className=''> 
                <CCol md={12} > 
                    <div className=''>
                        <CForm  className="row gy-2 gx-3 ">
                          <CCol xs={12} className='mb-3'>
                            <CFormInput
                              userId="idInput"
                              placeholder="Enter your (HootLoot) ID *"
                              value={userId}
                              onChange={(e) => setUserId(e.target.value)}
                              required
                            />
                          </CCol>
                          <CCol xs={12} className='mb-3'>
                            <CFormInput
                              id="firstNameInput"
                              placeholder="First Name *"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                            />
                          </CCol>
                          <CCol xs={12} className='mb-3'>
                            <CFormInput
                              id="lastNameInput"
                              placeholder="Last Name *"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required
                            />
                          </CCol>
                          <CCol xs={12} className='mb-3'>
                            <CFormInput
                              id="emailInput"
                              type="email"
                              placeholder="johnd1l@southernct.edu *"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              />
                          </CCol>
                          <CCol xs={12} className='mb-3'>
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
                          <CCol xs={12} className='mb-3'>
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
                          <CCol xs={12} className='mb-3'>
                            <CFormInput
                              id="phoneInput"
                              placeholder="Phone number *"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              required
                            />
                          </CCol>
                          <CCol xs={12} className='mb-3'>
                            <CButton className='ccolor' 
                              type="submit" 
                              style={{position: 'relative', top:'20px'}}
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
