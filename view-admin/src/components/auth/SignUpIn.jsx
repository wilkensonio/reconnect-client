import {useState, useEffect} from 'react'
import SwitchForm from './SwitchForm';
import SignInForm from '../../views/SignInForm';
import SignUpForm from '../../views/SignUpForm';
import ResetPasswordModal from './ResetPasswordModal';
import VerifyEmailModal from './VerifyEmailModal';
import {CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
 

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
                                    <CTooltip content="To Reset password clicked on the reset password link on this page
                                        You will see a popup to enter your email address and new password. 
                                        Then click Next and you will receive a code though email to reset your password."
                                         placement="bottom">
                                        <span className="border border-primary bg-tooltip rounded-circle text-white d-flex justify-content-center align-items-center"
                                            style={{ cursor: 'pointer', color: '#007bff', marginLeft: '10px', width:'2rem', height: '2rem', paddingTop:'.2rem' }}>
                                            ?
                                        </span>
                                    </CTooltip>
                                </>) : 
                                <>
                                    Sign Up{'  '}
                                    <CTooltip content="Next button is not active until
                                     all field are validated. password must be 8 characters long, 
                                     with at least one uppercase letter and one number.
                                     Once you click on next, you will receive an email to verify your account." 
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
                            <CCol md={6} className="cmarginimg d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                                <img
                                    src="/assets/logo/reconnect.png"
                                    alt="logo"
                                    style={{ maxWidth: '100%', height: 'auto' }}  
                                />
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