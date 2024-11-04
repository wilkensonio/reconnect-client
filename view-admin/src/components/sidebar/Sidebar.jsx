import React from 'react'
import { CSidebar, CSidebarBrand, CSidebarHeader, CSidebarNav, CNavItem, CNavTitle, CBadge } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptop, faBell, 
  faUsers, faCalendar, 
  faUserPlus, faCog, faSignOutAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom'
import logo from '/assets/logo/Rc.png'
import { useNotifications } from '../../context/NotificationContext'; 

function sidebar() { 
  const { notifications } = useNotifications();

  return ( 
      <CSidebar className=" border-end-none" colorScheme="dark" unfoldable 
      >
        <CSidebarHeader className="border-0 mb-4">
          <CSidebarBrand className="reconnect-logo">
            
            <img src={logo} alt="Reconnect logo" 
              style={{
                width: '40px',  
                height: 'auto',  
                display: 'block', 
                padding: 0,
                margin: 0,
                marginLeft: '.5rem',
                border: 0
              }} />
          </CSidebarBrand>
        </CSidebarHeader>
        <CSidebarNav>
          {/* <CNavTitle className='mb-3' style={{margin:'0', padding:'0'}}>reconnect</CNavTitle>  */}
          <hr  style={{margin:'0', padding:'0'}}/> 
          
          <Link to="/dashboard" className="text-decoration-none text-light ms-3 mb-3 mt-2">
            <CNavItem className="d-flex  align-items-center me-3">
            <FontAwesomeIcon icon={faLaptop} className="nav-icon text-white" /> <span className='sidebar-text-link'>Dashboard</span>
            </CNavItem> 
          </Link> 

          {/* <Link to="/notifications" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex  align-items-center me-3">
            <FontAwesomeIcon icon={faBell} className="nav-icon text-white" /> Notifications 
            </CNavItem> 
          </Link>  */}
          {notifications.length > 0 ?(
          <Link to="/notifications" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex align-items-center me-3">
              <div style={{ position: 'relative' }}>
                <FontAwesomeIcon icon={faBell} className="nav-icon text-white bell-badge" />
                {notifications.length > 0 && (
                  <CBadge 
                    color="danger" 
                    shape="rounded-pill" 
                    className="position-absolute" 
                    style={{
                      top: '-8px', 
                      right: '4px', 
                      fontSize: '0.75rem',  
                      padding: '0.2rem 0.3rem'  
                    }}
                  >
                    {notifications.length} 
                    <span className="visually-hidden">unread messages</span>
                  </CBadge>
                )}
              </div>
              <span className='sidebar-text-link'>Notifications</span>
            </CNavItem> 
          </Link>  
          ):( 
          <Link to="/notifications" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex  align-items-center me-3"> 
            <FontAwesomeIcon icon={faBell} className="nav-icon text-white" /> 
                <span className='sidebar-text-link'>Notifications</span>
            </CNavItem> 
          </Link>)}

          <Link to="/availabilities" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex  align-items-center me-3"> 
              <FontAwesomeIcon icon={faClock} className="nav-icon text-white" />  
                <span className='sidebar-text-link'>Availabilities</span>
            </CNavItem> 
          </Link> 
           
          
          <Link to="/students" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex align-items-center me-3">
              <FontAwesomeIcon icon={faUsers} className="nav-icon text-white" /> <span className='sidebar-text-link'>All&nbsp;Students </span>
            </CNavItem> 
          </Link>

          <Link to="/calendar" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex align-items-center me-3">
              <FontAwesomeIcon icon={faCalendar} className="nav-icon text-white" /> <span className='sidebar-text-link'>Calendar</span>
            </CNavItem> 
          </Link>

          <Link to="/new-student" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex align-items-center me-3">
              <FontAwesomeIcon icon={faUserPlus} className="nav-icon text-white"  /> <span className='sidebar-text-link'>Add&nbsp;Student</span>
            </CNavItem> 
          </Link>

          <Link to="/account" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex align-items-center me-3">
            <FontAwesomeIcon icon={faCog} className="nav-icon text-white" /><span className='sidebar-text-link'>Account</span>
            </CNavItem> 
          </Link>

          <hr /> 
          <Link to="/logout" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex align-items-center me-3">
              <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon text-white" /> 
              <span className='sidebar-text-link'>Logout</span>
            </CNavItem> 
          </Link> 
 
          
        </CSidebarNav>
      </CSidebar> 
  )
}

export default sidebar