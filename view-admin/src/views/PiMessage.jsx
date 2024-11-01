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
import { updatePiMessage, getPiMessage, deletePiMessage} from '../apiservice/PiMessage';  
import { useBlur } from '../context/PiMessageContext';

function PiMessage() {
    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [duration, setDuration] = useState(15);  
    const [durationUnit, setDurationUnit] = useState('minutes');  
    const [loggedInUser, setLoggedInUser] = useState('');
    const { popup, togglePiPopup } = useBlur(); 
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState('');

    
    const handleDurationUnitChange = (e) => {
        setDurationUnit(e.target.value);
    };
    
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const userRes = await getUserByEmail(loggedInUser);  
          setUser(userRes);
        } catch (error) {
          console.error(error);
        }
      };
        const  userSignInEmail = localStorage.getItem('reconnect_signin_email'); 
        setLoggedInUser(userSignInEmail); 
        fetchUser();
    }, []);

    useEffect(() => { 
      if (!user) return;
      const fetchActiveMessage = async () => {
          setError('');
          setSuccess('');
          try {
              const response = await getPiMessage(user.user_id); 
              console.log(response, "response from getPiMessage"); 
              setMessage(response.message);
              setDuration(response.duration);  
              setDurationUnit(response.duration_unit); 
          } catch (error) { 
              console.error(error);
          }
      }  
          
        fetchActiveMessage();
      }, [user]);

     
    
    const handleSendMessage = async () => {
      const userData = {
        user_id: user.user_id,
        message: message,
        duration: duration,
        duration_unit: durationUnit
      } 
      
      try {  
        setSuccess('');
          await updatePiMessage(userData);  
          setError('');
          setSuccess('Message updated successfully'); 
      } catch (error) {
          console.error(error);
      }   
        
    };
     
    const closeAndResetModal = () => {
      togglePiPopup();  
      setMessage('');
      setDuration(15);
      setDurationUnit('minutes');
    }; 

    const handleDeleteMessage = async () => {
      try {
        setSuccess('');
        const response = await deletePiMessage(user.user_id);
        closeAndResetModal();
        setSuccess('No message is displayed on the kiosk');
      } catch (error) {
        console.error(error);
      }
    }

    

  return (
    <div>  
    
      <CButton color="primary" onClick={togglePiPopup} className="w-100"
       style={{ 
        height: 'auto'}}>  
        Leave Message on Kiosk
      </CButton>
      

      <CModal visible={popup} onClose={closeAndResetModal}>
        <CModalHeader onClose={closeAndResetModal} className='border-0'>
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
              <CButton color="danger" type="button" onClick={handleDeleteMessage}>
                Delete Pi Message
              </CButton>
              <CButton color="primary" type="submit">
                Send
              </CButton> 
            </CModalFooter>
          </CForm>
          {success && <p className="mt-3 p-3 text-center text-success h3">{success}</p>}
          {error && <p className="mt-3 p-3 text-center text-success h3">{error}</p>}
        </CModalBody>
      </CModal> 
    </div>
  );
}

export default PiMessage;
