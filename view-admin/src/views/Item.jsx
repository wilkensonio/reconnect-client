import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Item() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get('api/users/');  
          setUsers(response.data);
          setLoading(false);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      }

      fetchUsers();
    }, []);
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
  
    return (
      <div className='container'> 
        <h1>Users</h1>
        <div className="row">
          {users.map(user => (
            <div className='col-md-4 md-4' key={user.id}>
              <div className='card'>
                <div className='card-body'> 
                  <h4>{user.user_id}</h4>
                  <div className='d-flex'>
                    <p className=' me-2'>{user.first_name}</p>
                    <p className=' me-2'>{user.last_name}</p>  
                  </div>
                  <p>{user.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div> 
      </div>
    );
}

export default Item