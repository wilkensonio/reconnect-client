import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';  
import { MemoryRouter } from 'react-router-dom';
import Account from '../views/Account';
 
beforeAll(() => {
  global.import = {
    meta: {
      env: {
        VITE_APP_API_KEY: 'mock_api_key'
      }
    }
  };
});


test('renders Account component', () => {
  render(
    <MemoryRouter>
      <Account />
    </MemoryRouter>
  );
 
  const linkElement = screen.getByText(/Update profile/i);
  expect(linkElement).toBeInTheDocument();
});

 

 

 
