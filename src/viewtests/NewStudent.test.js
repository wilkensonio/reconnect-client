import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';  
import { MemoryRouter } from 'react-router-dom';
import NewStudent from '../views/NewStudent';
 
beforeAll(() => {
  global.import = {
    meta: {
      env: {
        VITE_APP_API_KEY: 'mock_api_key'
      }
    }
  };
});


test('renders NewStudent component', () => {
  render(
    <MemoryRouter>
      <NewStudent />
    </MemoryRouter>
  );
 
  const linkElement = screen.getByText(/Upload or Add New Students/i);
  expect(linkElement).toBeInTheDocument();
});
