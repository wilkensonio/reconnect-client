import React, {useEffect, useState} from 'react';
import { CAlert, CBadge, CButton, CCard, CCardBody, CCol, CRow } from '@coreui/react';
import { Link } from 'react-router-dom';
import { userNotifications, deleteNotification, deleteNotifications } from '../apiservice/NotificationService'; 
 import { getUserByEmail } from '../apiservice/UserService';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    const loggedInUser = localStorage.getItem('reconnect_signin_email');
    const getUser = async () => {
      try {
        const user = await getUserByEmail(loggedInUser);  
        setUser(user); 
      } catch (error) {
        console.error(error);
      }
    }
    getUser();

  }, []);  
  
  useEffect(() => { 
    const getUserNotifications = async () => {
      try { 
        const notifications = await userNotifications(user.user_id); 
        setNotifications(notifications);
      } catch (error) {
        console.error(error);
      }
    };
    if (user.user_id) getUserNotifications();
  }, [user]); 

  // const handleClearAll = () => {
  //   setNotifications([]);
  // };

 


  useEffect(() => {
    // Simulate receiving new notifications every 5 seconds
    const notificationInterval = setInterval(() => {
      const newMsg = `New Notification: Appointment scheduled at ${new Date().toLocaleTimeString()}`; 
      
      setAlertMessage(newMsg);
      setShowAlert(true); 
       
      setNotifications((prevNotifications) => [...prevNotifications, newMsg]);
      
      // Automatically hide the alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);  
    }, 10000);  

    // Clean up the interval when component unmounts
    return () => clearInterval(notificationInterval);
  }, []);
  



  return (
    <div>
      <h2 className="d-flex justify-content-center  align-items-center text-white mb-4 position-relative mt-3"> 
        <CRow> 
          <CCol className='mb-3'>
            <CButton color="primary" className="position-relative me-4">
              Notifications
              <CBadge color="danger" position="top-end" shape="rounded-pill">
                {notifications.length} <span className="visually-hidden">unread messages</span>
              </CBadge>
            </CButton> 
          </CCol>
          
          <CCol className='mb-3'>
            <CButton color='primary'>
              Clear All 
            </CButton>
          </CCol>
        </CRow>
      </h2>
      <div className='container mb-3'>
        <Link to='/dashboard'>
          <span className='text-white'>Back to dashboard</span>
        </Link>
      </div>

      {showAlert && (
        <CAlert color="info"  style={{ 
            position: 'absolute', 
            top: '1rem',  
            right: '2rem',  
            zIndex: 3000,  
            width: '48%'  
        }}>
          {alertMessage}
        </CAlert>
      )}

      <div className="d-flex flex-column align-items-center w-100 ">
        {notifications.map((notification, index) => (
          <CCard key={index} className="mb-3 card-color" 
          style={{ width: '70%',
          display: 'flex', flexDirection: 
          'row', justifyContent: 'space-between', 
          alignItems: 'center',
          background: '#e9e9e9',
          
          }}>
            <CCardBody style={{ flex: '1' }}>{notification}</CCardBody>
            <CButton color="danger" size="sm" className="text-white me-3" 
              style={{ width: '3rem', marginLeft: 'auto' }}>
              X
            </CButton>
          </CCard>
        ))}
      </div>
    </div>
  );
}

export default Notification;
