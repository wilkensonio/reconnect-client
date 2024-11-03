import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';  
import { MemoryRouter } from 'react-router-dom';
import ResetPasswordModal from '../components/auth/ResetPasswordModal';

beforeAll(() => {
  global.import = {
    meta: {
      env: {
        VITE_APP_API_KEY: 'mock_api_key'
      }
    }
  };
});

test('renders ResetPassword component', () => {
  const mockSetShowModal = jest.fn();  

  render(
    <MemoryRouter>
      <ResetPasswordModal showModal={true} setShowModal={mockSetShowModal} />
    </MemoryRouter>
  );

  const linkElement = screen.getByText(/Reset Password/i);
  expect(linkElement).toBeInTheDocument();
});
