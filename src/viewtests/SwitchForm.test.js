import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';  
import { MemoryRouter } from 'react-router-dom';
import SwitchForm from '../components/auth/SwitchForm';
 
beforeAll(() => {
  global.import = {
    meta: {
      env: {
        VITE_APP_API_KEY: 'mock_api_key'
      }
    }
  };
});


test('renders SwithForm component', () => {
  render(
    <MemoryRouter>
      <SwitchForm />
    </MemoryRouter>
  );
 
  const linkElement = screen.getByText(/switch form/i);
  expect(linkElement).toBeInTheDocument();
});
