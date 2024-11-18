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
  CCard,
  CSpinner
} from '@coreui/react';
import { getUserByEmail } from '../apiservice/UserService';
import { updatePiMessage, getPiMessage, deletePiMessage} from '../apiservice/PiMessage';  
import { useBlur } from '../context/PiMessageContext';



function PiMessage() { 
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(15);  
  const [durationUnit, setDurationUnit] = useState('minutes');  
  const [loggedInUser, setLoggedInUser] = useState('');
  const { popup, togglePiPopup } = useBlur();  
  const [error, setError] = useState('');
  const [user, setUser] = useState('');
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [hasMessage, setHasMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [piMsg, setPiMsg] = useState(0);

  const getUser = async () => {
    setLoading(true);
    try { 
      const userRes = await getUserByEmail(loggedInUser);
      setUser(userRes);
    } catch (error) {
      console.error('Trying to get user', error);
    }
    finally {
      
    }     
  };

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const  userSignInEmail = localStorage.getItem('reconnect_signin_email');  
        
        setLoggedInUser(userSignInEmail);
        await fetchActiveMessage();   
        
      } catch (error) { 
        console.error('Trying to get user', error);
      }
    };
    
      if (loggedInUser != null || loggedInUser != undefined || loggedInUser != '' ) 
        getUserEmail();
      
  }, []);
  
  const handleMessageChange = (e) => {
    const selectedMessage = e.target.value;
    setMessage(selectedMessage);

    // Parse the duration and unit from the selected message
    const durationMatch = selectedMessage.match(/(\d+)\s*(minutes?|seconds?|hours?|days?|weeks?|months?)/i);
    if (durationMatch) {
      const [, durationValue, unit] = durationMatch;
      setDuration(durationValue);
      setDurationUnit(unit.toLowerCase());
    }
  }; 

  const handleButtonClick = async () => {
    try {
      setLoading(true);
      await getUser();  
      if (!user || !user.user_id) {
        console.error('User not set. Cannot fetch active message.');
        return; // Exit without showing the modal
      }
      await fetchActiveMessage(); // Fetch the active message after the user is set
      togglePiPopup(); // Open the modal
    } catch (error) {
      console.error('Error handling button click:', error);
    } finally {
      setLoading(false);
      setPiMsg(p => p + 1);
    }
  };
  
 
  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };
    
  const handleDurationUnitChange = (e) => {
    console.log(e.target.value);
    
      setDurationUnit(e.target.value);
  }; 
 
    
  const fetchActiveMessage = async () => { 
    if (!user || !user.user_id) {
      console.error('User not set. Cannot fetch active message.');
      return;
    }
    try {
      const response = await getPiMessage(user.user_id); 
      setMessage(response.message || '');
      setDuration(response.duration || 15);
      setDurationUnit(response.duration_unit || 'minutes');
      setHasMessage('Kiosk has a message');
    } catch (error) {
      setMessage('');
      setDuration(15);
      setDurationUnit('minutes');
      setHasMessage('No message on the kiosk'); 
      console.error('Error fetching active message or message doest exits:', error);
    }
    finally {
      setLoading(false);
    } 
  };  
  
  const handleSendMessage = async () => {
    const userData = {
      user_id: user.user_id,
      message: message,
      duration: duration,
      duration_unit: durationUnit
    } 
    
    try {   
        setError(''); 
        await updatePiMessage(userData);  
        setMessage(userData.message);
        setDuration(userData.duration);
        setDurationUnit(userData.duration_unit);
        setHasMessage('Kiosk has a message'); 
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
      await deletePiMessage(user.user_id); 
      setMessage('');
      setHasMessage('No message on the kiosk');
      setDeleteMessage(true);
    } catch (error) {
      if (!error.detail){
        setError('Failed to delete message or no message to delete');
      }  
      console.error(error);
    }  
  } 

  return (
    <div>   
      <CButton
        color="primary"
        onClick={handleButtonClick}
        className="w-100"
        style={{
          height: 'auto',
        }}
      >
      {piMsg == 0 ? 'Kiosk Message' : 'Update'}
      </CButton> 

      <CModal className='pi-modal' visible={popup} onClose={()=>{
        togglePiPopup() 
        setLoading(false)
        }}
        alignment='center'   
        >
        <CModalHeader onClose={()=>{
            togglePiPopup()  
          }} className='border-0'>
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
              list='presetKioskMessages'
              onChange={handleMessageChange}
              style={{ marginBottom: '2rem' }}
              maxLength={50} // Limit characters
              label="Message to display on the kiosk"
              required
            />
            <datalist id="presetKioskMessages">
              <option value="Running late, back in 5 minutes"></option>
              <option value="Running late, back in 10 minutes"></option>
              <option value="Running late, back in 15 minutes"></option>
              <option value="Be back in 5 minutes"></option>
              <option value="Be back in 10 minutes"></option>
              <option value="Be back in 15 minutes"></option>
              <option value="Be back in 60 minutes"></option>
              <option value="Be back in 2 hours"></option>
              <option value="Be back in 3 hours"></option>
            </datalist>

            <CFormInput
              type="number"
              placeholder="Duration"
              value={duration} 
              onChange={handleDurationChange}
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
                Delete Message
              </CButton>
              <CButton color="primary" type="submit"> 
                {message != '' ? 'Update Message':'Display Message'}
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
