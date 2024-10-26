import React from 'react'
import {Header, Footer, Sidebar, Content} from '../components/index'
import NotificationDisplay from '../components/notification/NotificationDisplay'

function Layout() {
  return (
    <div>
        <Sidebar className="sidebar"/>
        <div className="wrapper d-flex flex-column min-vh-100">
          <header className="d-flex sticky-top boder-0 d-lg-none" style={{background: '#e9e9e9'}}>
            <Header  />  
          </header>
          <NotificationDisplay />
          <div className="body flex-grow-1 pt-2" 
            style={{
              // background: '#e9e9e9',
              // background: 'rgb(2,0,36)',
              // background: 'linear-gradient(10deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
              // background: '#d4dfed',
              background: '#071689', 
              // background: 'red',
              transition: 'width 0.3s ease'}}> 
            <Content/>
          </div>
          <div className="body pt-2"
          style={{
            // background: '#e9e9e9',
            // background: 'rgb(2,0,36)',
            // background: 'linear-gradient(10deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
            // background: '#d4dfed',
            // background: '#071689',
            // background: 'navy',
            transition: 'width 0.3s ease'}}> 
          <Footer  />
          </div>
        </div>
    </div>
  )
}

export default Layout

 
 
 