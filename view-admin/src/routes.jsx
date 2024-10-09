import React from 'react'   

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Calendar = React.lazy(() => import('./views/Calendar'));


const routes = [
    {path: '/', element: <Dashboard/>},
    {path: 'calendar', element: <Calendar/>},
    {path: 'dashboard', element: <Dashboard/>},
];

export default routes;  