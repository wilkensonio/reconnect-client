import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';  
import { MemoryRouter } from 'react-router-dom';
import SignupForm from '../views/SignUpForm';
 
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
      <SignupForm />
    </MemoryRouter>
  );
 
  const linkElement = screen.getByText(/testSignupForm/i);
  expect(linkElement).toBeInTheDocument();
});
