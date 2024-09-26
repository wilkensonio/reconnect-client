import React from 'react'
import { CNavbar, CContainer, CNavbarBrand, CNavbarToggler, CCollapse, CNavbarNav, CNavItem, CNavLink, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider, CForm, CFormInput, CButton, CBadge } from '@coreui/react'
import { BsEnvelope, BsCalendar, BsPeople, BsGearFill } from "react-icons/bs";
import { Link } from 'react-router-dom';

function Header() {
  const [visible, setVisible] = React.useState(false)
  return (
    <div>
      <CNavbar expand="lg">
        <CContainer fluid> 
          <CNavbarToggler onClick={() => setVisible(!visible)} />
          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav>
              <CNavItem>
                <CNavLink component={Link} to="/dashboard" active>
                  Dashboard
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink component={Link} to="/messages">
                  <BsEnvelope className='me-2'/>Messages&nbsp;
                  <span className="badge text-bg-secondary">4</span>
                </CNavLink>
              </CNavItem>
              <CNavItem> 
                <CNavLink component={Link} to="/calendar">
                  <BsCalendar className='me-2'/>
                  Calendar
                </CNavLink>
              </CNavItem> 
              <CNavItem>
                <CNavLink component={Link} to="/newstudent">
                <BsPeople  className='me-2'/>New student
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink component={Link} to="/account">
                <BsGearFill className='me-2'/>
                  Account
                </CNavLink>
              </CNavItem>
            </CNavbarNav> 
          </CCollapse>
        </CContainer>
      </CNavbar>
    </div> 
  )
}

export default Header