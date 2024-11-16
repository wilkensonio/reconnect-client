/**
 * PiMessage component allows users to send and delete messages on a kiosk.
 * 
 * @component
 * @example
 * return (
 *   <PiMessage />
 * )
 * 
 * @returns {JSX.Element} The rendered component.
 * 
 * @description
 * This component provides a modal interface for users to leave a message on a kiosk.
 * It fetches the logged-in user's information and any existing message on the kiosk.
 * Users can send a new message or delete an existing one.
 * 
 * @function
 * @name PiMessage
 * 
 * @property {boolean} modalVisible - State to control the visibility of the modal.
 * @property {string} message - State to store the message to be sent to the kiosk.
 * @property {number} duration - State to store the duration for which the message will be displayed.
 * @property {string} durationUnit - State to store the unit of the duration (e.g., minutes, hours).
 * @property {string} loggedInUser - State to store the email of the logged-in user.
 * @property {object} user - State to store the user information fetched from the API.
 * @property {boolean} deleteMessage - State to indicate if the message has been deleted.
 * @property {string} hasMessage - State to indicate if there is an active message on the kiosk.
 * @property {string} error - State to store any error messages.
 * 
 * @function handleDurationUnitChange
 * @description Handles the change event for the duration unit select input.
 * @param {object} e - The event object.
 * 
 * @function handleSendMessage
 * @description Sends the message to the kiosk by calling the updatePiMessage API.
 * 
 * @function handleDeleteMessage
 * @description Deletes the message from the kiosk by calling the deletePiMessage API.
 * 
 * @function fetchUser
 * @description Fetches the logged-in user's information from the API.
 * 
 * @function fetchActiveMessage
 * @description Fetches the active message on the kiosk from the API.
 */
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
    const [error, setError] = useState('');
    const [user, setUser] = useState('');
    const [deleteMessage, setDeleteMessage] = useState(false);
    const [hasMessage, setHasMessage] = useState('');

    
    const handleDurationUnitChange = (e) => {
      console.log(e.target.value);
      
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
        if (!user)
          fetchUser();
    }, [user]);

    useEffect(() => { 
      if (!user) return;
      const fetchActiveMessage = async () => {
          setError('');
          try {
              const response = await getPiMessage(user.user_id);  
              setMessage(response.message);
              setDuration(response.duration);  
              setDurationUnit(response.duration_unit); 
              if (response.message)
                setHasMessage('Kiosk has a message');
          } catch (error) { 
            if (!error.response)
                setHasMessage('No message on the kiosk');  
            setError('Failed to get message');
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
          setError('');
          const r = await updatePiMessage(userData);  
          console.log(r);
          setDeleteMessage(false);
      } catch (error) {
        setError('Failed to send message');
          console.error(error);
      }   
        
    }; 

    const handleDeleteMessage = async () => {
      if (!user) return;
      try { 
        setError('');
        const response = await deletePiMessage(user.user_id); 
        setDeleteMessage(true);
      } catch (error) {
        if (!error.response){
          setError('Failed to delete message or no message to delete');
        } 
        
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
      

      <CModal className='pi-modal' visible={popup} onClose={()=>togglePiPopup()}
        alignment='center'   
        >
        <CModalHeader onClose={()=>togglePiPopup()} className='border-0'>
          <CModalTitle>Leave a Message on the Kiosk</CModalTitle>
        </CModalHeader>
        <CModalBody className='card-color pi-modal'>
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
          {
            message ? (
              <p className="mt-3 p-3 text-center text-success h6">{hasMessage}</p>
              ) : !message ? (
              <p className='mt-3 p-3 text-center text-success h6"'>{hasMessage}</p>
            ) : (deleteMessage && error)
          }  
        </CModalBody>
      </CModal> 
    </div>
  );
}

export default PiMessage;
