import React, { Suspense, useState , useEffect} from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';   
import Layout from './layout/Layout';
import SignUpIn from './components/auth/SignUpIn';
import { CSpinner } from '@coreui/react';
import { NotificationProvider } from './context/NotificationProvider';
import { WebSocketProvider } from './context/WebSocketProvider';
 
function App() { 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state
  const userId = '70573536';
  
  useEffect(() => {
    const token = localStorage.getItem('reconnect_access_token'); 
    
    // Simulate async operation  
    setTimeout(() => {
      if (token && token !== 'undefined') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);   
    }, 500);  
  }, []);

  if (loading) {
    // Show loading spinner until token check is complete
    return (
      <div className="pt-3 text-center">
        <CSpinner color="primary" variant="grow" />
      </div>
    );
  }

  return ( 
    <WebSocketProvider  userId={userId}>
    <NotificationProvider>
      <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
      >
        <Routes> 
          <Route path="/signin" element={<SignUpIn />} />  
          <Route path="*" name="Home" element={isAuthenticated ? <Layout /> : <Navigate to="/signin"/>} /> 
        </Routes>
      </Suspense>  
    </NotificationProvider>
    </WebSocketProvider>
  );
}

export default App;
