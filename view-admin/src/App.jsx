import React, { Suspense, useState } from 'react';
import { Route, Routes } from 'react-router-dom'; 
import Messages from './views/Messages'; 
import Signup from './views/SignUpForm';
import SignIn from './views/SignInForm';
import Layout from './layout/Layout';
import { CSpinner } from '@coreui/react';
 
function App() { 

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
        <Route path="/signup" element={<Signup />} />
        <Route path="*" name="Home" element={<Layout />} /> 
      </Routes>
    </Suspense>  
  );
}

export default App;
