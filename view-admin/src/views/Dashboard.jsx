import React, {useEffect, useState} from 'react';
import { CButton, CRow, CCol, CBadge } from '@coreui/react';
import PiMessage from './PiMessage';
import NewStudent from './NewStudent';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [notifications, setNotifications] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [numberOfStudents, setNumberOfStudents] = useState(10);
  const [piModalActive, setPiModalActive] = useState(false);

  useEffect(() => {
    setNotifications([
      'This is some text within a card body.',
        'This is some text within a card body.',
        'This is some text within a card body.',
        'This is some text within a card body.',
        'This is some text within a card body.',
        'This is some text within a card body.',
        'This is some text within a card body.',
        'This is some text within a card body.', 
        'This is some text within a card body.', 
    ])
  }, []); 
  

  return (
    <div className="text-white">
      <h2 className="text-center text-white mb-5 position-relative mt-3">
        Faculty Dashboard
      </h2>
      <CRow className="mb-4 me-2 ms-2">
        <CCol sm={3} className="mb-4">
          <Link to='/notifications'>
            <CButton color="primary" className="position-relative w-100"
             style={{ height: 'auto' }}>
              Notifications
              <CBadge color="danger" position="top-end" shape="rounded-pill">
                {notifications.length} <span className="visually-hidden">unread messages</span>
              </CBadge>
            </CButton> 
          </Link>
        </CCol>
        <CCol sm={3} className="mb-4">
          <PiMessage />
        </CCol>
        <CCol sm={3} className="mb-4">
          <Link to='/new-student'>
            <CButton color="primary" className="w-100" style={{ height: 'auto' }}>
              Add New Students
            </CButton>
          </Link>
        </CCol>
        <CCol sm={3} className="mb-4">
          <Link to='/students'>
            <CButton color="primary" className="position-relative w-100" style={{ height: 'auto' }}>
              All Students
              <CBadge color="danger" position="top-end" shape="rounded-pill">
                {numberOfStudents} <span className="visually-hidden">unread messages</span>
              </CBadge>
            </CButton> 
          </Link>
        </CCol>
        <CCol sm={3} className="mb-4">
          <Link to='/account'>
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
