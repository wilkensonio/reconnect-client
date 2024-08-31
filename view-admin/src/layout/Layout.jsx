import React from 'react'
import {Header, Footer, Sidebar, Content} from '../components/index'

function Layout() {
  return (
    <div>
        <Sidebar className="sidebar"/>
        <div className="wrapper d-flex flex-column min-vh-100">
          <header className="d-flex  d-lg-none">
            <Header  />  
          </header>
          <div className="body flex-grow-1 pt-2"> 
            <Content/>
          </div>
          <Footer />
        </div>
    </div>
  )
}

export default Layout