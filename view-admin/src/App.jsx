import React, { Suspense, useState , useEffect} from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'; 
import Messages from './views/Messages'; 
import Signup from './views/SignUpForm';
import SignIn from './views/SignInForm';
import Layout from './layout/Layout';
import { CSpinner } from '@coreui/react';
 
function App() { 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const token = localStorage.getItem('reconnect_access_token'); 
    
    // Simulate async operation  
    setTimeout(() => {
      if (token && token !== 'undefined') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);  // Set loading to false after token check
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
    <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
    >
      <Routes> 
        <Route path="/signin" element={<SignIn />} />             
        <Route path="/signup" element={<Signup />}/>
        <Route path="*" name="Home" element={isAuthenticated ? <Layout /> : <Navigate to="/signin"/>} /> 
      </Routes>
    </Suspense>  
  );
}

export default App;
