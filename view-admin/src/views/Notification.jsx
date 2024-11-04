/**
 * Notification component that displays user notifications and allows for deletion of individual or all notifications.
 *
 * @component
 * @example
 * return (
 *   <Notification />
 * )
 *
 * @returns {JSX.Element} The rendered Notification component.
 *
 * @function
 * @name Notification
 *
 * @description
 * This component fetches and displays notifications for the logged-in user. It provides functionality to delete individual notifications or clear all notifications. The component also handles loading states and displays alerts for user feedback.
 *
 * @typedef {Object} Notification
 * @property {number} id - The unique identifier of the notification.
 * @property {string} message - The message content of the notification.
 *
 * @typedef {Object} User
 * @property {number} user_id - The unique identifier of the user.
 * @property {string} email - The email of the user.
 *
 * @typedef {Object} Error
 * @property {string} detail - The error detail message.
 *
 * @state {Array<Notification>} notifications - The list of notifications for the user.
 * @state {boolean} showAlert - Flag to show or hide the alert message.
 * @state {string} alertMessage - The message content of the alert.
 * @state {User} user - The logged-in user information.
 * @state {boolean} loading - Flag to indicate loading state.
 *
 * @function
 * @name getUser
 * @description Fetches the logged-in user information by email.
 * @async
 * @returns {Promise<void>}
 *
 * @function
 * @name getUserNotifications
 * @description Fetches the notifications for the logged-in user.
 * @async
 * @returns {Promise<void>}
 *
 * @function
 * @name handleDeleteNotification
 * @description Deletes a specific notification by its ID.
 * @async
 * @param {number} notification_id - The ID of the notification to delete.
 * @returns {Promise<void>}
 *
 * @function
 * @name handleDeleteNotifications
 * @description Deletes all notifications for the logged-in user.
 * @async
 * @returns {Promise<void>}
 */
import React, {useEffect, useState} from 'react';
import { CAlert, CBadge, CButton, CCard, CCardBody, CCol, CRow, CSpinner } from '@coreui/react';
import { Link } from 'react-router-dom';
import { userNotifications, deleteNotification, deleteNotifications } from '../apiservice/NotificationService'; 
import { getUserByEmail } from '../apiservice/UserService';
import { tokenExpired } from '../apiservice/TokenService';
import { useNotifications } from '../context/NotificationContext';


function Notification() {
  const {notifications, setNotifications} = useNotifications();
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
        if(user.user_id != undefined){
          const notifications = await userNotifications(user.user_id); 
          setNotifications(notifications.reverse()); 
        } 
      } catch (error) {
        tokenExpired(error.detail);
        console.error(error);
      }
      finally {
        setLoading(false);
      }
    };
    if (user.user_id){
        getUserNotifications(); 
        const intervalId = setInterval(() => {
          getUserNotifications(); 
          localStorage.setItem('user_notifications', notifications.length);
        }, 1000);   
        return () => clearInterval(intervalId);
    }  
  }, [user.user_id]);  

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
      <h1 className='text-white text-center mt-2 mb-4'>Notofications</h1>
      <div className='container mb-3'>
          <Link to='/dashboard'>
            <span className='text-white'>Back to dashboard</span>
          </Link>
        </div>
      <span hidden>testNotifications</span>
      {notifications.length <= 0 ? <p className='text-white text-center h5'>No notifications</p> :(<CCard className=" " 
        style={{

          background:  '#e9e9e9',
          width: '100%', 
          minHeight: '80vh',
          filter: showAlert ? 'blur(5rem)' : 'none',
          transition: 'filter 0.3s',
        }}
      >
        <h2 className="d-flex justify-content-center  align-items-center text-white mb-4 position-relative mt-3"> 
          <CRow> 
            <CCol className='mb-3' hidden>
              <CButton color="primary" className="ccolor position-relative me-4" > 
                Notifications
                <CBadge color={notifications.length > 0 ? "danger": ''}position="top-end" shape="rounded-pill">
                  {notifications.length > 0 && notifications.length} <span className="visually-hidden">unread messages</span>
                </CBadge>
              </CButton> 
            </CCol>
            
            <CCol className='mb-3'>
              <CButton className=' ccolor'
              onClick={handleDeleteNotifications}
              >
                Clear All 
              </CButton>
            </CCol>
          </CRow>
        </h2> 
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
      </CCard>)}
    </div>
  );
}

export default Notification;
