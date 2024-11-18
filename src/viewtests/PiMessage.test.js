import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';  
import { MemoryRouter } from 'react-router-dom';
import PiMessage from '../views/PiMessage'; 
import { BlurDashboardProvider } from '../context/PiMessageContext';
 

beforeAll(() => {
  global.import = {
    meta: {
      env: {
        VITE_APP_API_KEY: 'mock_api_key'
      }
    }
  };
});


test('renders PiMessage component', () => {
  render(
    <MemoryRouter>
      <BlurDashboardProvider>
        <PiMessage />
      </BlurDashboardProvider> 
    </MemoryRouter>
  );
 
  const linkElement = screen.getByText(/Kiosk Message/i);
  expect(linkElement).toBeInTheDocument();
});
