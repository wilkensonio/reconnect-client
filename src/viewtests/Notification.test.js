import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';  
import { MemoryRouter } from 'react-router-dom';
import Notification from '../views/Notification';
import { BlurDashboardProvider } from '../context/PiMessageContext';
import { NotificationProvider } from '../context/NotificationContext';

beforeAll(() => {
  global.import = {
    meta: {
      env: {
        VITE_APP_API_KEY: 'mock_api_key'
      }
    }
  };
});


test('renders Notification component', () => {
  render(
    <MemoryRouter>
      <BlurDashboardProvider>
        <NotificationProvider>
          <Notification />
        </NotificationProvider>
      </BlurDashboardProvider>
    </MemoryRouter>
  );
 
  const linkElement = screen.getByText(/testNotifications/i);
  expect(linkElement).toBeInTheDocument();
});
