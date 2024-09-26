import { useState } from 'react'
import Layout from './layout/Layout'
import {Route, Routes} from 'react-router-dom'
import Calendar from './components/content/Calendar'
import Messages from './components/content/Messages'
import NewStudent from './components/content/NewStudent'
import Account from './components/content/Account'
import Dashboard from './components/content/Dashboard'
import './scss/custom.scss'

function App() { 
  return (
    <>
      <Routes>
        <Route path='/calendar' element={<Calendar/>} />
        <Route path='/messages' element={<Messages/>} />
        <Route path='/newstudent' element={<NewStudent/>} />
        <Route path='/account' element={<Account/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
      </Routes> 
       <Layout />  
    </>
  )
}

export default App
