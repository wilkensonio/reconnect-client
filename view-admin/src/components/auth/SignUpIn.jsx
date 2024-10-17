import {useState, useEffect} from 'react'
import SwitchForm from './SwitchForm';
import SignInForm from '../../views/SignInForm';
import SignUpForm from '../../views/SignUpForm';
import ResetPasswordModal from './ResetPasswordModal';
import {CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from '@coreui/react';


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
                    <p className='h3 d-flex justify-content-center mt-3 mb-5'>{isLogin ? 'Sign In' : 'Sign Up'}</p>
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
                            {isLogin ? <div className='cmarginsignin'><SignInForm  onResetPassword={handleResetPassword} /></div> : <SignUpForm />}
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
          
            <ResetPasswordModal showModal={showModal} setShowModal={setShowModal} />

        </div>
    )
}

export default SignUpIn