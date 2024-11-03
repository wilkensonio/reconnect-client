import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';  
import { MemoryRouter } from 'react-router-dom';
import Student from '../views/Students';
 
beforeAll(() => {
  global.import = {
    meta: {
      env: {
        VITE_APP_API_KEY: 'mock_api_key'
      }
    }
  };
});


test('renders Student component', () => {
  render(
    <MemoryRouter>
      <Student/>
    </MemoryRouter>
  );
 
  const linkElement = screen.getByText(/testStudents/i);
  expect(linkElement).toBeInTheDocument();
});
