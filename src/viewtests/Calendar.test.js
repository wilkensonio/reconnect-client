import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Calendar from '../views/Calendar';
import { BlurDashboardProvider } from '../context/PiMessageContext';
import { NotificationProvider } from '../context/NotificationContext';



beforeAll(()=>{
    global.import = {
        meta: {
          env: {
            VITE_APP_API_KEY: 'mock_api_key'
          }
        }
    }
});

jest.mock('../apiservice/UserService.js', () => ({
    getUserByEmail: jest.fn().mockResolvedValue({ /* mock user data */ })
}));


jest.mock('@fullcalendar/react', () => {
    return () => <div>Mocked FullCalendar</div>;  
  });
  
  jest.mock('@fullcalendar/daygrid', () => {
    return () => <div>Mocked dayGridPlugin</div>;
  });
  
  jest.mock('@fullcalendar/timegrid', () => {
    return () => <div>Mocked timeGridPlugin</div>;
  });
  
  jest.mock('@fullcalendar/list', () => {
    return () => <div>Mocked listPlugin</div>;
  });
  
  jest.mock('@fullcalendar/interaction', () => {
    return () => <div>Mocked interactionPlugin</div>;
  }); 
 

test('renders Calendar component', async () => {

    render(
        <MemoryRouter>
            <BlurDashboardProvider>
                <NotificationProvider>
                    <Calendar />
                </NotificationProvider>
            </BlurDashboardProvider>
        </MemoryRouter>
    );
    const linkElements = await screen.findAllByText(/Calendar/i);
    expect(linkElements.length).toBeGreaterThan(0);
    expect(linkElements[0]).toBeInTheDocument();
} );

