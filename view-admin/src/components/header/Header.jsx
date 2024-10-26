import React from 'react'
import { CNavbar, CContainer, CNavbarBrand, CNavbarToggler, CCollapse, CNavbarNav, CNavItem, CNavLink, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider, CForm, CFormInput, CButton, CBadge } from '@coreui/react'
import { BsEnvelope, BsCalendar, BsPeople, BsGearFill } from "react-icons/bs";
import { Link } from 'react-router-dom';

function Header() {
  const [visible, setVisible] = React.useState(false)
  return (
    <div className='w-100 sticky-top'> 
      <CNavbar expand="lg" className='header border-0 text-white'>
        <CContainer> 
          <Link to='/dashboard' className="text-decoration-none">
            <CNavbarBrand>
              <img src='/assets/logo/rconnect.png' alt="Reconnect logo"
                style={{
                  width: '25%', 
                }}
              />
            </CNavbarBrand>
          </Link>
          <CNavbarToggler onClick={() => setVisible(!visible)}
            className='bg-white border-0'
          />
          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav className='text-white' color='white'>
              <Link to='/dashboard' className="text-decoration-none">
                <CNavItem>
                  <CNavLink className='text-white' component={Link} to="/dashboard" active>
                    Dashboard
                  </CNavLink>
                </CNavItem>
              </Link>

              <Link to='/students' className="text-decoration-none">
                <CNavItem>
                  <CNavLink className='text-white'>
                    <BsPeople className='me-2'/>Students 
                  </CNavLink>
                </CNavItem>
              </Link>

              <Link to='/calendar' className="text-decoration-none">
                <CNavItem>
                  <CNavLink className='text-white'>
                    <BsCalendar className='me-2'/>Calendar
                  </CNavLink>
                </CNavItem>
              </Link>

              <Link to='/new-student' className="text-decoration-none">
                <CNavItem>
                  <CNavLink className='text-white'>
                    <BsPeople className='me-2'/>Add student
                  </CNavLink>
                </CNavItem>
              </Link>
               

              <Link to='/account' className="text-decoration-none">
                <CNavItem>
                  <CNavLink className='text-white'>
                    <BsGearFill className='me-2'/> Account
                  </CNavLink>
                </CNavItem>
              </Link> 
               
              </CNavbarNav> 
            </CCollapse>
        </CContainer>
    </CNavbar>
    </div>
  )
 
  
}

export default Header