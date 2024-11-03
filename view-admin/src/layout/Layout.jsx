import React from 'react'
import {Header, Footer, Sidebar, Content} from '../components/index'

function Layout() {
  return (
    <div>
        <Sidebar className="sidebar"/>
        <div className="wrapper d-flex flex-column min-vh-100"
          style={{
             transition: 'margin-left 0.5s ease-in-out, width 0.5s ease-in-out' 
          }}
        >
          <header className="d-flex sticky-top boder-0 d-lg-none" style={{background: '#e9e9e9'}}>
            <Header  />  
          </header> 
          <div className="body flex-grow-1 pt-2" 
            style={{ 
              background: '#071689',  
             }}> 
            <Content/>
          </div>
          <div className="body pt-2"
          style={{ 
           }}> 
          <Footer  />
          </div>
        </div>
    </div>
  )
}

export default Layout

 
 
 
  
 
 