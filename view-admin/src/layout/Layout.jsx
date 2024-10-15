import React from 'react'
import {Header, Footer, Sidebar, Content} from '../components/index'

function Layout() {
  return (
    <div>
        <Sidebar className="sidebar"/>
        <div className="wrapper d-flex flex-column min-vh-100">
          <header className="d-flex  d-lg-none" style={{background: '#e9e9e9'}}>
            <Header  />  
          </header>
          <div className="body flex-grow-1 pt-2" 
            style={{
              // background: '#e9e9e9',
              // background: 'rgb(2,0,36)',
              background: 'linear-gradient(10deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
              // background: '#d4dfed',
              transition: 'width 0.3s ease'}}> 
            <Content/>
          </div>
          <Footer />
        </div>
    </div>
  )
}

export default Layout

 
 
 