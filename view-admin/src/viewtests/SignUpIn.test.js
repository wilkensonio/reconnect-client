import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';  
import { MemoryRouter } from 'react-router-dom';
import SignUpIn from '../components/auth/SignUpIn';
 
beforeAll(() => {
  global.import = {
    meta: {
      env: {
        VITE_APP_API_KEY: 'mock_api_key'
      }
    }
  };
});


test('renders Signup component', () => {
  render(
    <MemoryRouter>
      <SignUpIn />
    </MemoryRouter>
  );
 
  const linkElement = screen.getByText(/testSignUpIn/i);
  expect(linkElement).toBeInTheDocument();
});
