import React from 'react'   

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Calendar = React.lazy(() => import('./views/Calendar'));
const Students = React.lazy(() => import('./views/Students'));
const NewStudent = React.lazy(() => import('./views/NewStudent'));
const Logout = React.lazy(() => import('./views/Logout'));
const Account = React.lazy(() => import('./views/Account'));


const routes = [
    {path: '/', element: <Dashboard/>},
    {path: 'calendar', element: <Calendar/>},
    {path: 'dashboard', element: <Dashboard/>},
    {path: 'students', element: <Students/>},
    {path: 'new-student', element: <NewStudent/>},
    {path: 'logout', element: <Logout/>},
    {path: 'account', element: <Account/>},
];

export default routes;  