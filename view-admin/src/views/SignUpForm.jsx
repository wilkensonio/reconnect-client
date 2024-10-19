import React, { useEffect, useState } from 'react';
import { CForm, CCol, CFormInput, CButton, CRow} from '@coreui/react';
import {sendEmail} from '../ApiService/MailService';
import useFormValidation from '../components/validButton/useFormValidation';
 

const SignupForm = ({onVerifySignup}) => { 
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(''); 
  const [sentCode, setSentCode] = useState(''); 
  

  const validateFields = fiedls => {
    const {userId, firstName, lastName, email, password, phoneNumber} = fiedls;
    return (
      /^\d{8}$/.test(userId) &&
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.trim() !== '' &&
      email.toLocaleLowerCase().endsWith('@southernct.edu') &&
      password.trim() !== '' &&
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&  
      /^\d{10}$/.test(phoneNumber)
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
      setSentCode(response.data.verification_code); // The code sent to the user 
      setShowModal(true);   
    } catch (error) { 
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

  localStorage.setItem('reconnect_signup_data', JSON.stringify(userData));  

  const handleVerifyEmail = async () => {
    onVerifySignup();
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  

    if (!/^\d{8}$/.test(userId)) {
      setError('Invalid HootLoot ID' );
      return;
    } 
    
    if (!email.toLocaleLowerCase().endsWith('@southernct.edu')) {
      setError('Please enter a valid email ending with @southernct.edu');
      return;
    }  
   
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      setError('Password must be at least 8 characters long, with at least one uppercase letter and one number');
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Invalid phone number');
      return;
    }

   
    await sendEmailVerification(); 
  };  
  
  return ( 
    <div className=""> 
        <div className='d-flex justify-content-center align-items-center '> 
              <CRow className=''> 
                <CCol md={12} > 
                    <div className=''>
                        <CForm onSubmit={handleSubmit} className="row gy-2 gx-3 ">
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
                            <CFormInput
                              id="passwordInput"
                              type="password"
                              placeholder="Password *"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
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
