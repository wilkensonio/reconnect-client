import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import Calendar from './components/content/Calendar';
import Messages from './components/content/Messages';
import NewStudent from './components/content/NewStudent';
import Account from './components/content/Account';
import Dashboard from './components/content/Dashboard';
import Signup from './components/content/signup';
import './scss/custom.scss';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication

  return (
    <>
      <Routes>
        {/* Signup Route */}
        <Route path="/" element={<Signup />} />

        {/* Protected Routes */}
        {isAuthenticated && (
          <>
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/newstudent" element={<NewStudent />} />
            <Route path="/account" element={<Account />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </>
        )}
      </Routes>

      {/* Only show Layout when authenticated */}
      {isAuthenticated && <Layout />}
    </>
  );
}

export default App;
