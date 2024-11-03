import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';  
import { MemoryRouter } from 'react-router-dom';
import Availability from '../views/Availability';
 
beforeAll(() => {
  global.import = {
    meta: {
      env: {
        VITE_APP_API_KEY: 'mock_api_key'
      }
    }
  };
});


test('renders Availability component', () => {
  render(
    <MemoryRouter>
      <Availability />
    </MemoryRouter>
  );
 
  const linkElement = screen.getByText(/testAvailability/i);
  expect(linkElement).toBeInTheDocument();
});

 
