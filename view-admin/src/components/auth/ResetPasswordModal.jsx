import React, { useState } from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton, CForm, CFormInput } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordModal = ({ showModal, setShowModal }) => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

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
   
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      setError('Password must be at least 8 characters long, with at least one uppercase letter and one number');
      return;
    }

    const data ={
      email: email,
      password: password 
    }

    try {
      // await axios.post('/api/send-reset-email', { email, newPassword });

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
      // await axios.post('/api/verify-reset-code', { email, verificationCode });

      setError('');
      setShowModal(false);
      alert('Password reset successfully.');
    } catch (error) {
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
    navigate('/signin');
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
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <CFormInput
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-3"
            />
            <CFormInput
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-3"
            />
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

      <CModalFooter>
        <CButton color="primary" onClick={step === 1 ? handleNextStep : handleConfirmCode}>
          {step === 1 ? 'Next' : 'Reset Password'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ResetPasswordModal;
