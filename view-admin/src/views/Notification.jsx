import React, {useEffect, useState} from 'react';
import { CAlert, CBadge, CButton, CCard, CCardBody, CCol, CRow, CSpinner } from '@coreui/react';
import { Link } from 'react-router-dom';
import { userNotifications, deleteNotification, deleteNotifications } from '../apiservice/NotificationService'; 
import { getUserByEmail } from '../apiservice/UserService';
import { tokenExpired } from '../apiservice/TokenService';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true); 
 
 
  useEffect(() => {
    const loggedInUser = localStorage.getItem('reconnect_signin_email');
    const getUser = async () => {
      try {
        const user = await getUserByEmail(loggedInUser);  
        setUser(user); 
      } catch (error) {
        tokenExpired(error.datail); 
        console.error(error);
      }
    }
    getUser();
  }, []);  
  
  
  useEffect(() => { 
    const getUserNotifications = async () => { 
      try {  
        const notifications = await userNotifications(user.user_id); 
        setNotifications(notifications.reverse());  
      } catch (error) {
        tokenExpired(error.detail);
        console.error(error);
      }
      finally {
        setLoading(false);
      }
    };
    if (user.user_id){
      const intervalId = setInterval(() => {
        getUserNotifications(); 
      }, 500);  
      return () => clearInterval(intervalId);
    }  
  }, [user]);  

  const handleDeleteNotification = async (notification_id) => {
    setLoading(true);
    try { 
      await deleteNotification(notification_id);
      setNotifications(notifications.filter(n => n.id !== notification_id));  
    }
    catch (error) { 
      console.error(error);
    } finally {
      setLoading(false);
    }  
  } 
  // Clear all notifications
  const handleDeleteNotifications = async () => {
    setLoading(true);
    try {
      setLoading(true);
      await deleteNotifications(user.user_id);
      setNotifications(nottifications);
      setLoading(false);
    }
    catch (error) { 
      console.error(error);
    } finally {
      setLoading(false
      );
    }
  }


  return (
    <div>
      <h2 className="d-flex justify-content-center  align-items-center text-white mb-4 position-relative mt-3"> 
        <CRow> 
          <CCol className='mb-3'>
            <CButton color="primary" className="position-relative me-4">
              Notifications
              <CBadge color={notifications.length > 0 ? "danger": ''}position="top-end" shape="rounded-pill">
                {notifications.length > 0 && notifications.length} <span className="visually-hidden">unread messages</span>
              </CBadge>
            </CButton> 
          </CCol>
          
          <CCol className='mb-3'>
            <CButton color='primary'
            onClick={handleDeleteNotifications}
            >
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

      {loading ? (
        <div className="d-flex justify-content-center">
          <CSpinner color="danger" />
        <span className="text-white ms-2">Loading...</span>
      </div>
      ): notifications.length > 0 ? (
        <div className="d-flex flex-column align-items-center w-100">
          {notifications.map((notification, index) => (
            <div key={index} className="mb-3 card-color" 
            style={{ 
            width: '80%', 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: '#fff', //#e9e9e9
            padding: '0',
            position: 'relative',
            borderTopRightRadius: '0',
            borderBottomRightRadius: '0',
          
            
            }}>
              <div style={{ flex: '1', padding:'0 0 0 1rem', margin: '0'}} className='shadow'>{notification.message}</div>
              <CButton color="danger" size="sm" className="text-white me-0 border-0 notifiction-btn-hover" 
                style={{
                    // position: 'absolute',
                    top: '0', 
                    right: '0',
                    bottom: '0',
                    alignSelf: 'stretch', 
                    margin: '0', 
                    borderRadius: '0', 
                    borderLeft: 'none',
                    padding: '0 1rem',
                }}
                onClick={() => handleDeleteNotification(notification.id) }>
                <span className='fw-bold text-dark x-notifiction-btn-hover'
                  style={{ fontSize: '1rem', 
                   
                  }}
                >X</span>
              </CButton>
            </div>
          ))}
      </div>
      ): (
        <p className='text-white text-center h2'>You have no notifications </p> 
      )}
    </div>
  );
}

export default Notification;
