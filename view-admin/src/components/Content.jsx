import React, { Suspense } from 'react' 
import { CContainer, CSpinner } from '@coreui/react'
import {Navigate, Routes, Route } from 'react-router-dom'
import routes from '../routes'  
const Content = () => {
  return (
    <CContainer>
      <Suspense fallback={<CSpinner color='primary'/>}> 
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  element={route.element}
                />
              )
            )
          })}
          <Route path='/faculty' element={<Navigate to="/faculty/dashboard" replace />} />
        </Routes> 
      </Suspense>
    </CContainer>
  )
}

export default Content