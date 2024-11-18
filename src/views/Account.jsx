/**
 * Account component allows users to view and update their profile information.
 * 
 * @component
 * @example
 * return (
 *   <Account />
 * )
 * 
 * @returns {JSX.Element} The rendered Account component.
 * 
 * @description
 * This component fetches user data from the server using the email stored in localStorage.
 * It allows users to update their first name, last name, phone number, and password.
 * Email and user ID fields are read-only.
 * 
 * @function
 * @name Account
 * 
 * @property {string} user_id - The ID of the user.
 * @property {string} first_name - The first name of the user.
 * @property {string} last_name - The last name of the user.
 * @property {string} email - The email of the user.
 * @property {string} phone_number - The phone number of the user.
 * @property {string} error - Error message to display if an error occurs.
 * @property {string} success - Success message to display if the profile is updated successfully.
 * @property {string} update_password - The new password entered by the user.
 * @property {string} confirm_update - The confirmation of the new password.
 * @property {boolean} showPassword - State to toggle the visibility of the password field.
 * @property {boolean} showConfirmPassword - State to toggle the visibility of the confirm password field.
 * 
 * @method
 * @name useEffect
 * @description Fetches user data when the component mounts.
 * 
 * @method
 * @name handleUpdate
 * @description Handles the form submission to update user profile.
 * 
 * @method
 * @name togglePasswordVisibility
 * @description Toggles the visibility of the password field.
 * 
 * @method
 * @name toggleConfirmPasswordVisibility
 * @description Toggles the visibility of the confirm password field.
 */
import React, {useEffect, useState} from 'react';
import {getUserByEmail} from '../apiservice/UserService';
import { CButton, CCard, CCardBody, CCardImage,
   CCol, CForm, CFormInput, CInputGroup, 
   CInputGroupText, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 
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
        setError('');
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

    setError('');
    setSuccess('');

    
    const userData = {
      user_id: user_id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone_number: phone_number,
      password: update_password
    };
    
    if (first_name.trim().length === 0 
      || last_name.trim().length === 0 
      || email.trim().length === 0 
      || phone_number.trim().length === 0
      || (update_password.trim().length === 0 
      && confirm_update.trim().length === 0)) {

      setError('All fields are required');
      return;

    }  
      
    if (update_password !== confirm_update) {
      setError('Passwords do not match');
      return;
    }
    if (update_password.trim().length < 8) {
      setError('Password must be at least 6 characters');
      return;
    } 
    if (!/[A-Z]/.test(update_password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[a-z]/.test(update_password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }
    if (!/[0-9]/.test(update_password)) {
      setError('Password must contain at least one digit');
      return;
    }
    if (!/[!@#$%^&*]/.test(update_password)) {
      setError('Password must contain at least one special character');
      return;
    }   
    if (phone_number.trim().length !== 10) {  
      setError('Phone number must be 10 digits');
      return;
    }
    if (!/^\d{10}$/.test(phone_number)) {
      setError('Phone number must be all digits');
      return;
    }
    

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
      console.error(error);
      
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
    <>
      <h1  className='text-white text-center mt-2  mb-4'>Update profile</h1>
      <div className='container mt-3 mb-3'>
        <Link to='/dashboard'>
                <span className='text-white'>Back to dashboard</span>
        </Link>
      </div>
      <div className="d-flex justify-content-center align-items-center"> 
        <CCard style={{ width: '40rem', background: '#e9e9e9' }} className='shadow'>
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
                    disabled
                  />
                </CCol>
                <CCol xs={12} className='mb-4'>
                  <CFormInput
                    id="userIdInput"
                    type="text" 
                    value={user_id}
                    style={{ width: '100%' }}
                    readOnly
                    disabled
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
    </>
  ); 
}

export default Account;
