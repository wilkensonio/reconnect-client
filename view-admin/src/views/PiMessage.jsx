import React, { useState, useEffect } from 'react';
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CCard
} from '@coreui/react';
import { getUserByEmail } from '../apiservice/UserService';
import { piMessage } from '../apiservice/PiMessage';

function PiMessage() {
    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [duration, setDuration] = useState(15); // Default to 15 minutes
    const [durationUnit, setDurationUnit] = useState('minutes'); // Default unit 
    const [loggedInUser, setLoggedInUser] = useState('');

    
    const handleDurationUnitChange = (e) => {
        setDurationUnit(e.target.value);
    };
    
    useEffect(() => {
        const  userSignInEmail = localStorage.getItem('reconnect_signin_email'); 
        setLoggedInUser(userSignInEmail); 
    }, []);

   
    
    const handleSendMessage = async () => {
        try { 
            const user = await getUserByEmail(loggedInUser);  
            const userData = {
              user_id: user.user_id,
              message: message,
              duration: duration,
              duration_unit: durationUnit
            }
            const response = await piMessage(userData);
            console.log(response);
        } catch (error) {
            console.error(error);
        } 
    
        // Close modal and reset the form
        setModalVisible(false);
        setMessage('');  
        setDuration(15);  
        setDurationUnit('minutes');  
    };
 
  

  return (
    <div>  
    
      <CButton color="primary" onClick={() => setModalVisible(true)} className="w-100"
       style={{ 
        height: 'auto'}}>  
        Leave Message on Kiosk
      </CButton>
      

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader onClose={() => setModalVisible(false)} className='border-0'>
          <CModalTitle>Leave a Message on the Kiosk</CModalTitle>
        </CModalHeader>
        <CModalBody className='card-color'>
          <CForm
            onSubmit={(e) => {
              e.preventDefault();  
              handleSendMessage();  
            }}
            
          >
            <CFormInput
              type="text"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ marginBottom: '2rem' }}
              maxLength={50} // Limit characters
              label="Message to display on the kiosk"
              required
            />
            <CFormInput
              type="number"
              placeholder="Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1" // Prevent zero or negative values
              style={{ marginBottom: '2rem' }}
              label="Duration to display the message"
              required
            />
            <CFormSelect required value={durationUnit} onChange={handleDurationUnitChange}>
              <option value="minutes">Minutes</option>
              <option value="seconds">Seconds</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option> 
            </CFormSelect>
            <CModalFooter className='border-0 mt-3'> 
              <CButton color="primary" type="submit">
                Send
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal> 
    </div>
  );
}

export default PiMessage;
