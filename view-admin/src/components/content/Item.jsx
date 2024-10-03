import React, { useEffect, useState } from 'react'


function Item() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetch('api/items/')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setItems(data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }, []);
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
  
    return (
      <div>
        <h1>Items</h1>
        <ul>
          {items.map(item => (
            <li key={item.id}>{item.name}: {item.description}</li>
          ))}
        </ul>
      </div>
    );
}

export default Item