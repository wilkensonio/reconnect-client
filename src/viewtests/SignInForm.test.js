import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';  
import { MemoryRouter } from 'react-router-dom';
import SignInForm from '../views/SignInForm';
 
beforeAll(() => {
  global.import = {
    meta: {
      env: {
        VITE_APP_API_KEY: 'mock_api_key'
      }
    }
  };
});


test('renders SignInIp component', () => {
  render(
    <MemoryRouter>
      <SignInForm />
    </MemoryRouter>
  );
 
  const linkElement = screen.getByText(/testSignInForm/i);
  expect(linkElement).toBeInTheDocument();
});
