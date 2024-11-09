import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';  
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../views/Dashboard';
import { BlurDashboardProvider } from '../context/PiMessageContext';
import { NotificationProvider } from '../context/NotificationContext';


// Mock `localStorage`
beforeAll(() => {
  global.localStorage = {
    getItem: jest.fn(() => 'test_user@example.com'),  // Provide mock email
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };

  global.import = {
    meta: {
      env: {
        VITE_APP_API_KEY: 'mock_api_key'
      }
    }
  };
});

// Mock `getUserByEmail` and `userNotifications`
jest.mock('../apiservice/UserService', () => ({
  getUserByEmail: jest.fn().mockResolvedValue({ user_id: 'mockUserId', name: 'Mock User' })
}));

jest.mock('../apiservice/NotificationService', () => ({
  userNotifications: jest.fn().mockResolvedValue([
    { id: 1, message: 'Notification 1' },
    { id: 2, message: 'Notification 2' }
  ])
}));

test('renders Dashboard component', async () => {
  render(
    <MemoryRouter>
      <BlurDashboardProvider>
        <NotificationProvider>
          <Dashboard /> 
        </NotificationProvider>
      </BlurDashboardProvider> 
    </MemoryRouter>
  );

  const linkElement = await screen.findByText(/Faculty Dashboard/i);
  expect(linkElement).toBeInTheDocument();
});
