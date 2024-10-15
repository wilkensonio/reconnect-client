import React, { useState } from 'react';
import { CForm, CCol, CFormInput, CFormLabel, CButton, CRow, CCard, CCardBody, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import axios from 'axios';
 
 

const apiKey = import.meta.env.VITE_APP_API_KEY;

const SignupForm = () => {
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(''); 
  const [showModal, setShowModal] = useState(false);  
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);  
  const [verificationError, setVerificationError] = useState('');
  const [sentCode, setSentCode] = useState('');
 
  // Send the email verification code to the user
  const sendEmailVerification = async () => {
    try {
      const response = await axios.post('/api/verify-email/', { email }, {
        headers: {
          'R-API-KEY': `${apiKey}`,
        },
      }); 
      setSentCode(response.data.verification_code); // The code sent to the user 
      setShowModal(true);  

    } catch (error) { 
      setError('Failed to send verification email.');
    }
  }

  // Verify the email code, this code was sent to the user
  const verifyEmail = async () => {
    try {
      const data = {
        user_code: sentCode.toString().toUpperCase(),
        secret_code: verificationCode.toString().toUpperCase(),
      };
      
      const response = await axios.post('/api/verify-email-code/',data, { 
        headers: {
          'R-API-KEY': `${apiKey}`,
        }, 
      });
     
      if (response.status === 200) { 
        setVerificationError('');
        setIsVerified(true);
        handleSignup(); // Call signup only after verification
        setShowModal(false); 
        
      } 

    } catch (error) {
    
      setVerificationError('Invalid verification code.');
    }
  };  

  const handleSignup = async () => {
    const userData = {
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      phone_number: phoneNumber,
    };

    try { 
      const response = await axios.post('/api/signup/', userData, {
        headers: {
          'R-API-KEY': `${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      // Clear the form
      setUserId('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setPhoneNumber(''); 
   
      if (response.status === 200 || response.status === 201) {
        window.location.href = '/signin?success=account_created';
      }
      
    } catch (error) {  
        setError(error.response.data || 'Signup failed'); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  

     // Validate length HootLoot ID
     if (!/^\d{8}$/.test(userId)) {
      setError('Invalid HootLoot ID' );
      return;
    } 
    
    if (!email.endsWith('@southernct.edu')) {
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
// position-absolute top-50 start-50 translate-middle shadow
  return ( 
    <div className='d-flex justify-content-center align-items-center shadow bg-sign'
      style={{ height: '100vh' }}>
      <CCard  
       style={{
          background: '#e9e9e9',
          maxWidth: '50%', width: '90%',
          filter: showModal ? 'blur(5rem)' : 'none',
          transition: 'filter 0.3s', 
        }}>
        <CCardBody>
          <p className='h3 d-flex justify-content-center mt-2'>Sign up</p>
          <CRow>
            <CCol md={6} className="d-flex justify-content-center align-items-center">
              <img src="/assets/logo/reconnect.png" alt="Signup Illustration" style={{ maxWidth: '100%', height: 'auto' }} />
            </CCol>
            <CCol md={6} > 
                <CForm onSubmit={handleSubmit} className="row gy-2 gx-3 ">
                  <CCol xs={12}>
                    <CFormLabel htmlFor="idInput"></CFormLabel>
                    <CFormInput
                      userId="idInput"
                      placeholder="Enter your (HootLoot) ID"
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
                    <CButton color="primary" type="submit" style={{position: 'relative', top:'20px'}}>
                     Sign Up 
                    </CButton>
                    <div className='mt-4'>
                      <span className='d-flex justify-content-center pt-3'>
                        Have an account?&nbsp;
                        <a href='/signin' className='d-flex justify-content-center'>singn in </a>
                        </span> 
                    </div>
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

      {/* Modal for email verification */}
      <div style={{
          transition: 'filter 0.5s', 
      }}> 
   
        <CModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          alignment='center' 
        > 
          
          <CModalHeader onClose={() => setShowModal(false)}>
            <CModalTitle className='d-flex text-center'>Verify Your Email</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>Please enter the verification code sent to your email. </p>
            <p>
              <span className='text-muted'>
                If you do not see the email in your inbox check your spam  <br /> 
                
              </span>
            </p>
            <CFormInput
              placeholder="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            {verificationError && (
              <p className="text-danger">{verificationError}</p>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={verifyEmail}>
              Verify
            </CButton> 
          </CModalFooter>
        </CModal>
      </div>
    </ div>
  );
};

export default SignupForm;
