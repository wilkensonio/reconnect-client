import React, {useEffect, useState} from 'react'
import { CButton, CFormInput, 
    CModal, 
    CModalBody, CModalFooter, 
    CModalHeader, CModalTitle } from "@coreui/react";


import { verifyEmailCode } from "../../apiservice/MailService";
import { signupUser } from '../../apiservice/SignService';

/**
 * Handles the verification of the email code sent to the user
 * and signs up the user if the code is valid.
 * 
 * @param {boolean} showModal
 * @param {boolean} showModal
 * @param {function} setShowModal
 * @returns  {JSX.Element}
 */ 
function VerifyEmailModal({ showModal, setShowModal}) { 
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState(''); 
    const [sentCode, setSentCode] = useState('');

    useEffect(() => {
        const code = localStorage.getItem('reconnect_email_verification_code');
        setSentCode(code);
    });

    const verifyEmail = async () => {
        setError('') 
        
        if (!verificationCode) {
            setError('Please enter the verification code.');
            return;
        }

        if(sentCode !== verificationCode) {
            setError('Invalid verification code.');
            return;
        }
       
        console.log(sentCode, verificationCode);
        try {
            
            const res = await verifyEmailCode(sentCode, verificationCode);   
            console.log(res);
            
            setShowModal(false); 
            
            const userDataString  = localStorage.getItem('reconnect_signup_data');
            const userData = JSON.parse(userDataString);
            console.log(userData);
            
            await signupUser(userData); 
            
            window.location.href = '/signin?message=account_created'; 
            
        } catch (error) { 
            if (error.response)
                setError(error?.response?.data?.detail);
            console.error(error);
        }  
    } 

    return ( 
        <CModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            alignment='center' 
        > 
        
            <CModalHeader onClose={() => setShowModal(false)}>
            <CModalTitle className='d-flex text-center'>Verify Your Email</CModalTitle>
            </CModalHeader>
            <CModalBody>
            <p>Enter the verification code sent to your email. </p>
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
            {error && (
                <p className="text-danger">{error}</p>
            )}
            </CModalBody>
            <CModalFooter>
                <CButton className='ccolor' onClick={verifyEmail}>
                    Signup
                </CButton> 
            </CModalFooter>
        </CModal> 
    )
}

export default VerifyEmailModal


 
