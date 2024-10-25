import React, { useState } from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton, CForm, CFormInput, CInputGroupText, CInputGroup, CCol } from '@coreui/react';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 
import { resetPassword } from '../../apiservice/SignService';
import { sendEmail, verifyEmailCode } from '../../apiservice/MailService';
import { getUserByEmail } from '../../apiservice/UserService';



const ResetPasswordModal = ({ showModal, setShowModal }) => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);   
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  
 

  const navigate = useNavigate();

  const handleNextStep = async () => {
    if (!email || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!email.toLocaleLowerCase().endsWith('@southernct.edu')) {
      setError('Please enter a valid southern email');
      return;
    }  
   
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError('Password must be at least 8 characters long, with at least one uppercase letter and one number');
      return;
    } 

    try {
      setError('');
      // check that user exists
      const response = await getUserByEmail(email); 
      
      if (response.status === 400) {
        setError('No user found with this email.');
        return;
      }

      await sendEmail(email);
      setError('');
      setStep(2); // Move to step 2 after successful email send
    } catch (error) { 
      setError('Error sending email, please try again.');
    }
  };

  const handleConfirmCode = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code.');
      return;
    }

    try {
      const sentCode = localStorage.getItem('reconnect_email_verification_code');
      await verifyEmailCode(sentCode, verificationCode); 
      await resetPassword(email, newPassword); 
      
      setError('');
      setShowModal(false);

    } catch (error) {
      step(1);
      console.error(error);
      setError('Invalid code. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setStep(1);  
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setVerificationCode('');
    setError(''); 
    navigate('/signin?mesage=password_reset');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <CModal visible={showModal} onClose={handleCloseModal} alignment="center">
      <CModalHeader onClose={handleCloseModal}>
        <h5 className="modal-title">Reset Password</h5>
      </CModalHeader>

      {step === 1 ? (
        <CModalBody>
          <p>Enter your email and new password to reset your password.</p>
          <CForm>
              <CFormInput
              className='mb-3'
                type="email"
                placeholder="johnd1@southernct.edu *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
           
              <CInputGroup className='mb-3'>
                <CFormInput
                  id="passwordInput"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password *"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                 
                />
                <CInputGroupText onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </CInputGroupText>
              </CInputGroup>
             
            <CInputGroup>
              <CFormInput
                id="confirmPasswordInput"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password *"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                // className="mt-3"
              />
              <CInputGroupText onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>  
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </CInputGroupText>
            </CInputGroup>
            {error && <p className="text-danger mt-2">{error}</p>}
          </CForm>
        </CModalBody>
      ) : (
        <CModalBody>
          <p>Please enter the code sent to your email.</p>
          <CForm>
            <CFormInput
              type="text"
              placeholder="Enter code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            {error && <p className="text-danger mt-2">{error}</p>}
          </CForm>
        </CModalBody>
      )}

      <CModalFooter className='border-0'>
        <CButton color="primary" onClick={step === 1 ? handleNextStep : handleConfirmCode}>
          {step === 1 ? 'Next' : 'Reset  Password'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ResetPasswordModal;
