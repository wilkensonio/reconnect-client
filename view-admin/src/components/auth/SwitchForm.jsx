import { CForm, CFormCheck, CFormLabel } from '@coreui/react'
import React from 'react'


function SwitchForm(props) {  
  const handleSwitch = (e) => {
    
    if (e.target.id === 'login') {
      props.handleSwitch(true);  
    } else if (e.target.id === 'signup') {
      props.handleSwitch(false);  
    }
  };

  return (
    <div>
        <CForm className="form-container">
            <div className="slide-controls">
                <CFormCheck
                type="radio"
                name="slide"
                id="login"
                checked={props.isLogin}
                onChange={handleSwitch}
                />
                <CFormCheck
                type="radio"
                name="slide"
                id="signup"
                checked={!props.isLogin}
                onChange={handleSwitch}
                />
                <CFormLabel htmlFor="login" className="slide login">
                  Signin
                </CFormLabel>
                <CFormLabel htmlFor="signup" className="slide signup">
                  Signup
                </CFormLabel>
                <div className="slider-tab"></div>
            </div> 
        </CForm>
    </div>
  )
}

export default SwitchForm