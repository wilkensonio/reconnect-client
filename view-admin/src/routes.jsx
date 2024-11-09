import React from 'react'   
import { Navigate } from 'react-router-dom';
 
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Calendar = React.lazy(() => import('./views/Calendar'));
const Students = React.lazy(() => import('./views/Students'));
const NewStudent = React.lazy(() => import('./views/NewStudent'));
const Logout = React.lazy(() => import('./views/Logout'));
const Account = React.lazy(() => import('./views/Account'));
const Notifications = React.lazy(() => import('./views/Notification'));
const Availability = React.lazy(() => import('./views/Availability'));


const routes = [
    {path: '/', element: <Navigate to="/faculty/dashboard" replace />},
    {path: '/faculty', element: <Dashboard/>},
    {path: '/faculty/calendar', element: <Calendar/>},
    {path: '/faculty/dashboard', element: <Dashboard/>},
    {path: '/faculty/students', element: <Students/>},
    {path: '/faculty/new-student', element: <NewStudent/>},
    {path: '/faculty/logout', element: <Logout/>},
    {path: '/faculty/account', element: <Account/>},
    {path: '/faculty/notifications', element: <Notifications/>},
    {path: '/faculty/availabilities', element: <Availability/>}
];

export default routes;  