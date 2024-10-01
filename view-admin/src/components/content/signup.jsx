import React, { useState } from 'react';
import axios from 'axios';

function signup() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signupPayload = {
        email: email,
        password: password,
    };

    try {
      const response = await axios.post('/api/v1/signup/', signupPayload);
      setMessage('Signup successful!');
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.detail}`);
      } else {
        setMessage('Error connecting to the server.');
      }
    }
  };

  return (
    <div class="position-absolute top-50 start-50 translate-middle">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default signup;
