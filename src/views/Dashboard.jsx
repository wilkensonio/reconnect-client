/**
 * Dashboard component renders the faculty dashboard with various sections such as notifications, availabilities, 
 * adding new students, viewing all students, and profile management. It also handles fetching user data and notifications.
 *
 * @component
 * @example
 * return (
 *   <Dashboard />
 * )
 *
 * @returns {JSX.Element} The rendered dashboard component.
 *
 * @function
 * @name Dashboard
 *
 * @description
 * - Uses `useEffect` to fetch user data and notifications.
 * - Uses `useState` to manage local state for alerts, user data, and notifications.
 * - Utilizes `useBlur` and `useNotifications` context hooks for managing popup and notifications state.
 *
 * @dependencies
 * - React
 * - @coreui/react
 * - PiMessage
 * - NotificationService
 * - UserService
 * - NewStudent
 * - NotificationContext
 * - react-router-dom
 * - PiMessageContext
 */
import React, {useEffect, useState} from 'react';
import { CButton, CRow, CCol, CBadge } from '@coreui/react';
import PiMessage from './PiMessage'; 
import { userNotifications } from '../apiservice/NotificationService';
import {getUserByEmail} from '../apiservice/UserService';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';
import { useBlur } from '../context/PiMessageContext';


function Dashboard() {  
  const [user, setUser] = useState('');  
  const {popup, setPopup}  = useBlur(); 
  const {notifications, setNotifications} = useNotifications(); 

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
    if (user.user_id){
      const intervalId = setInterval(() => {
        getUserNotifications(); 
      }, 1000);  
      return () => clearInterval(intervalId);
    }
  }, [user]); 
     

  return (
    <div className="text-white w-100"
    style={{ 
      background: popup && '#e9e9e9',
      width: '100%',  
      height: '80vh',
      filter: popup ? 'blur(5rem)' : 'none',
      transition: 'filter 0.5s',   
    }}>
      <h2 className="text-center text-white mb-5 position-relative mt-3">
        Faculty Dashboard
      </h2>
      <CRow className="mb-4 me-2 ms-2">
        <CCol sm={3} className="mb-4">
          <Link to='/faculty/calendar'>
            <CButton color="primary" className="position-relative w-100"
             style={{ height: 'auto' }}>
              Calendar
              <CBadge color="danger" position="top-end" shape="rounded-pill" hidden>
                {notifications.length} <span className="visually-hidden">unread messages</span>
              </CBadge>
            </CButton> 
          </Link>
        </CCol>
        <CCol sm={3} className="mb-4">
          <Link to='/faculty/notifications'>
            <CButton color="primary" className="position-relative w-100"
             style={{ height: 'auto' }}>
              Notifications
              <CBadge color="danger" position="top-end" shape="rounded-pill" hidden>
                {notifications.length} <span className="visually-hidden">unread messages</span>
              </CBadge>
            </CButton> 
          </Link>
        </CCol>
        <CCol sm={3} className="mb-4">
          <Link to='/faculty/availabilities'>
            <CButton color="primary" className="position-relative w-100"
             style={{ height: 'auto' }}>
              Availabilities
            </CButton> 
          </Link>
        </CCol>
        <CCol sm={3} className="mb-4"> 
          {popup ? <PiMessage /> : <PiMessage />}
        </CCol>
        <CCol sm={3} className="mb-4">
          <Link to='/faculty/new-student'>
            <CButton color="primary" className="w-100" style={{ height: 'auto' }}>
              Add New Students
            </CButton>
          </Link>
        </CCol>
        <CCol sm={3} className="mb-4">
          <Link to='/faculty/students'>
            <CButton color="primary" className="position-relative w-100" style={{ height: 'auto' }}>
              All Students
            </CButton> 
          </Link>
        </CCol>
        <CCol sm={3} className="mb-4">
          <Link to='/faculty/account'>
            <CButton color="primary" className="position-relative w-100" style={{ height: 'auto' }}>
              Profile
            </CButton> 
          </Link>
        </CCol>
       
      </CRow> 
    </div>
  );
}

export default Dashboard;
