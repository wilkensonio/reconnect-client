import React from 'react'
import { CSidebar, CSidebarBrand, CSidebarHeader, CSidebarNav, CNavItem, CNavGroup, CNavTitle, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilPuzzle, cilCloudDownload, cilLayers, cilEnvelopeClosed, cilCalendar, cilPeople, cilAccountLogout, cilSettings, cilLaptop } from '@coreui/icons'
import logo from '/assets/logo/rconnect.png'

function sidebar() { 
  return ( 
      <CSidebar className="sidebar-narrow-unfoldable border-end" colorScheme="dark" unfoldable>
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
          <CNavItem href="#"><CIcon customClassName="nav-icon" icon={cilLaptop} /> Dashboard</CNavItem>
          <hr />
          <CNavItem href="#"><CIcon customClassName="nav-icon" icon={cilEnvelopeClosed} /> Messages  
          <CBadge color="primary ms-auto">12</CBadge></CNavItem>
          <CNavItem href="#"><CIcon customClassName="nav-icon" icon={cilCalendar} /> Calender</CNavItem> 
          <CNavItem href="#"><CIcon customClassName="nav-icon" icon={cilPeople} />New Student</CNavItem>
          <CNavItem href="#"><CIcon customClassName="nav-icon" icon={cilSettings} />Account</CNavItem>
          <hr />
          <CNavItem href="#"><CIcon customClassName="nav-icon" icon={cilAccountLogout} />Logout</CNavItem>
        </CSidebarNav>
      </CSidebar> 
  )
}

export default sidebar