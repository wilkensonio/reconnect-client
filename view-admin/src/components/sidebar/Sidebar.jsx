import React from 'react'
import { CSidebar, CSidebarBrand, CSidebarHeader, CSidebarNav, CNavItem, CNavTitle, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeClosed, cilCalendar, cilPeople, cilAccountLogout, cilSettings, cilLaptop } from '@coreui/icons'
import {Link} from 'react-router-dom'
import logo from '/assets/logo/rconnect.png'

function sidebar() { 
  return ( 
      <CSidebar className=" border-end" colorScheme="dark" unfoldable >
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand>
            <img src={logo} alt="Reconnect logo" 
              style={{
                width: '100%',  
                height: 'auto',  
                display: 'block',
                margin: 0,
                padding: 0,
                border: 0
              }} />
          </CSidebarBrand>
        </CSidebarHeader>
        <CSidebarNav>
          <CNavTitle>reconnect</CNavTitle> 
          <hr /> 
          
          <Link to="/dashboard" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex align-items-center me-3">
              <CIcon customClassName="nav-icon" icon={cilLaptop} /> Dashboard
              <CBadge color="primary ms-auto">12</CBadge> 
            </CNavItem> 
          </Link> 
          
          <Link to="/messages" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex align-items-center me-3">
              <CIcon customClassName="nav-icon" icon={cilEnvelopeClosed} /> Students
              <CBadge color="primary ms-auto">12</CBadge> 
            </CNavItem> 
          </Link>

          <Link to="/calendar" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex align-items-center me-3">
              <CIcon customClassName="nav-icon" icon={cilCalendar} /> Calendar
            </CNavItem> 
          </Link>

          <Link to="/newstudent" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex align-items-center me-3">
              <CIcon customClassName="nav-icon" icon={cilPeople} /> New Student
            </CNavItem> 
          </Link>

          <Link to="/account" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex align-items-center me-3">
              <CIcon customClassName="nav-icon" icon={cilSettings} />Account
            </CNavItem> 
          </Link>

          <hr />

          <Link to="/logout" className="text-decoration-none text-light ms-3 mb-3">
            <CNavItem className="d-flex align-items-center me-3">
              <CIcon customClassName="nav-icon" icon={cilAccountLogout} />Logout
            </CNavItem> 
          </Link> 
 
          
        </CSidebarNav>
      </CSidebar> 
  )
}

export default sidebar