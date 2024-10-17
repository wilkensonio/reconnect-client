import React from 'react';

function Dashboard() {
  return (
    <div className="text-white">
      <p>
        Welcome {localStorage.getItem('reconnect_first_name')}
      </p>
    </div>
  );
}

export default Dashboard;
