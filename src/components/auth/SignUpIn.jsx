import React, {useState, useEffect} from 'react'
import SwitchForm from './SwitchForm';
import SignInForm from '../../views/SignInForm';
import SignUpForm from '../../views/SignUpForm';
import ResetPasswordModal from './ResetPasswordModal';
import VerifyEmailModal from './VerifyEmailModal'
import {CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
import customTooltipStyle from '../../components/tooltip/CustomToolTip'
import  Cube from '../../components/cube/Cube'

function SignUpIn() {
   
    const [showModal, setShowModal] = useState(false); 
    const [isLogin, setIsLogin] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

    useEffect(() => {
        
        const handleResize = () => {
          setIsSmallScreen(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleSwitch = (loginState) => {
        setIsLogin(loginState);
    }

    const handleResetPassword = () => {
        setShowModal(!showModal);
    }

    const handleVerifyEmail = () => {
        setShowModal(!showModal);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <span hidden>testSignupIn</span>
            <CCard
            className='shadow'
                style={{ 
                    background: '#e9e9e9',
                    width: '100%', 
                    maxWidth: '900px',
                    minHeight: '750px',
                    filter: showModal ? 'blur(5rem)' : 'none',
                    transition: 'filter 0.3s',   
                }}>
                <CCardHeader style={{ borderBottom: 'none',  background: '#e9e9e9' }}> 
                    <div className="">    
                        <p className='h3 d-flex justify-content-center mt-3 mb-5'>
                            {isLogin ? (
                                <> 
                                    Sign In{'  '}
                                    <CTooltip 
                                        style={customTooltipStyle}
                                        content={
                                            <div>
                                                <p className='text-start mb-1'> <span className='text-danger'>
                                                    * </span>All Fields are required</p>
                                                <p className='text-start mb-1'> <span className='text-danger'>
                                                    1.</span>To Reset password clicked on the reset password link on this page.</p>
                                                <p className='text-start mb-1'> <span className='text-danger'>
                                                    2.</span>You will see a popup to enter your email address and new password.</p>
                                                <p className='text-start mb-1'> <span className='text-danger'>
                                                    3.</span>Then click Next and you will receive a code through email to reset your password.</p>
                                                <p className='text-start mb-1'> <span className='text-danger'> 
                                                    4.</span>Login button is not active until a valid email is entered ans at list 1 character for password.</p>
                                            </div>
                                        }
                                         placement="bottom">
                                        <span className="border border-primary bg-tooltip rounded-circle text-white d-flex justify-content-center align-items-center"
                                            style={{ cursor: 'pointer', color: '#007bff', marginLeft: '10px', width:'2rem', height: '2rem', paddingTop:'.2rem' }}>
                                            ?
                                        </span>
                                    </CTooltip>
                                </>) :
                                <> 
                                    Sign Up{'  '}
                                    <CTooltip 
                                        style={customTooltipStyle}
                                        content={
                                            <div>
                                                <p className='text-start mb-1'> <span className='text-danger'>
                                                * </span>All Fields are required</p>
                                                <p className='text-start mb-1'> <span className='text-danger'>
                                                    1.</span>Next button is not active until all fields are validated.</p>
                                                <p className='text-start mb-1'> <span className='text-danger'>
                                                    2.</span>password must be  at least 8 characters long, 1 uppercase letter and a number.</p>
                                                <p className='text-start mb-1'> <span className='text-danger'>
                                                    3.</span>Once you click on next, you will receive an email to verify your account.</p> 
                                            </div>
                                        }
                                        placement="bottom">
                                        <span className="border border-primary bg-tooltip rounded-circle text-white d-flex justify-content-center align-items-center"
                                            style={{ cursor: 'pointer', color: '#007bff', marginLeft: '10px', width:'2rem', height: '2rem', paddingTop:'.2rem' }}>
                                            ?
                                        </span>
                                    </CTooltip>
                                </>  
                            }
                          
                        </p>
                    </div>
                <SwitchForm isLogin={isLogin} handleSwitch={handleSwitch} />
                </CCardHeader>
                <CCardBody className="mt-5" style={{marginBottom:'35px !importan'}}> 
                    <CRow>
                        {!isSmallScreen && (
                            <CCol md={6} className=" mt-5cmarginimg d-flex justify-content-center align-items-center" style={{ height: '100%' }}> 
                                <Cube />
                            </CCol>
                        )}
                        <CCol> 
                            {isLogin ? <div className='cmarginsignin'><SignInForm  onResetPassword={handleResetPassword} /></div> : <SignUpForm onVerifySignup={handleVerifyEmail}/>}
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
            {
                isLogin? <ResetPasswordModal showModal={showModal} setShowModal={setShowModal} />
                : <VerifyEmailModal showModal={showModal} setShowModal={setShowModal} />
            }

        </div>
    )
}

export default SignUpIn