import { CFooter, CLink } from '@coreui/react';
import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  const startYear = 2024;

  return (
    <CFooter className='border-0'>
      <div>
        <CLink>ReConnect</CLink>
        <span>
          &copy; {startYear} {currentYear > startYear ? `- ${currentYear}` : ''}
        </span>
      </div>
      <div>
        {/* <span>Powered by</span> */}
        {/* <CLink href="https://coreui.io">CoreUI</CLink> */}
      </div>
    </CFooter>
  );
}

export default Footer;
