import React, {useEffect, useState} from 'react';
// import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm,  CInput, CLabel, CRow } from '@coreui/react';
import {getUserByEmail} from '../apiservice/UserService';
import { CButton, CCard, CCardBody, CCardImage, CCol, CForm, CFormInput, CFormLabel, CInputGroup, CInputGroupText, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDashboard, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 
import customTooltipStyle from '../components/tooltip/CustomToolTip'
import { updateUser } from '../apiservice/UserService';
import { Link } from 'react-router-dom';

function Account() {
  const [user_id, setUserId] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [update_password, setUpdatePassword] = useState('');
  const [confirm_update, setConfirmUpdate] = useState('');
  const [showPassword, setShowPassword] = useState(false);   
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  
  
  

  useEffect(() => {
    const userSignInEmail = localStorage.getItem('reconnect_signin_email'); 
    const getUser = async () => {
      try {
        const response = await getUserByEmail(userSignInEmail); 
        setUserId(response.user_id);
        setFirstName(response.first_name);
        setLastName(response.last_name);
        setEmail(response.email);
        setPhoneNumber(response.phone_number);
      } catch (error) {
        setError('Failed to get user data');
      }
    }
    getUser();
  }, []);

  const handleUpdate = async (e) => { 
    e.preventDefault();

    if (update_password !== confirm_update) {
      setError('Passwords do not match');
      return;
    }

    const userData = {
      user_id: user_id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone_number: phone_number,
      password: update_password
    }; 

    try {
      setError('');
      const response = await updateUser(userData); 
      setSuccess('Profile updated successfully'); 
      setConfirmUpdate('');
      setUpdatePassword('');
     
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      setError('Failed to update profile');
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return ( 
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}> 
        <CCard style={{ width: '40rem' }} className='shadow'>
          <div className='mt-3 h3 d-flex justify-content-center'>
             <>   
             Profile                   
              <CTooltip 
                  style={customTooltipStyle}
                  content={
                      <div>
                          <p className='text-start mb-1'> <span className='text-danger'>
                              </span>Email & ID are read-only</p> 
                      </div>
                  }
                    placement="bottom">
                  <span className="border border-primary bg-tooltip rounded-circle text-white d-flex justify-content-center align-items-center"
                      style={{ cursor: 'pointer', color: '#007bff', marginLeft: '10px', width:'2rem', height: '2rem', paddingTop:'.2rem' }}>
                      ?
                  </span>
                </CTooltip>
              </>
            </div>
        <CCardImage orientation="top" 
        src='/assets/avatar.png' 
        style={{ width: '20%',  
          margin: 'auto', 
          marginTop: '0', 
          }}
        />
        <CCardBody>
          <CRow>  
            <CCol>  
              <CForm onSubmit={handleUpdate}>
                <CCol xs={12} className='mb-4'>
                  <CFormInput
                    id="emailInput"
                    type="text" 
                    value={email}
                    style={{ width: '100%' }}
                    readOnly
                  />
                </CCol>
                <CCol xs={12} className='mb-4'>
                  <CFormInput
                    id="userIdInput"
                    type="text" 
                    value={user_id}
                    style={{ width: '100%' }}
                    readOnly
                  />
                </CCol>
                <CCol xs={12} className='mb-4'>
                  <CFormInput
                    id="fristNameInput"
                    type="text" 
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </CCol>
                <CCol xs={12} className='mb-4'>
                  <CFormInput
                    id="lastNameInput"
                    type="text" 
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </CCol>
                <CCol xs={12} className='mb-4'>
                  <CFormInput
                    id="phoneInput"
                    type="text" 
                    value={phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </CCol>
                <CCol xs={12} className='mb-3'>
                  <CInputGroup>
                    <CFormInput
                      id="passwordInput"
                      type={showPassword ? 'text' : 'password'} // Toggle password visibility
                      placeholder="Password *"
                      value={update_password}
                      onChange={(e) => setUpdatePassword(e.target.value)}
                      required
                    />
                      <CInputGroupText onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </CInputGroupText>
                    </CInputGroup>
                </CCol>
                <CCol xs={12} className='mb-3'>
                  <CInputGroup>
                    <CFormInput
                      id="confirmPasswordInput"
                      type={showConfirmPassword ? 'text' : 'password'} 
                      placeholder="Confirm password *"
                      value={confirm_update}
                      onChange={(e) => setConfirmUpdate(e.target.value)}
                      required
                    /> 
                    <CInputGroupText onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>  
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </CInputGroupText>
                  </CInputGroup>
                </CCol>
                 
                <CCol xs={12} className='mt-3'>
                  <CButton className='ccolor mb-4' type="submit" 
                    style={{position: 'relative', top:'10px'}}
                    
                  > Update
                  </CButton> 
                </CCol>  
                  <div>
                    {
                    error ? (
                    <p className='text-danger mt-3'>{error}</p>
                    ):(
                      <p className='text-success mt-3'>{success}</p>
                    )}
                  </div>
              </CForm>
              <div className='mt-3 mb-3'>
                <Link to='/dashboard'>
                        Back to dashboard
                </Link>
              </div>
            </CCol>
          </CRow> 
          </CCardBody>
        </CCard>
      </div> 
  ); 
}

export default Account;
