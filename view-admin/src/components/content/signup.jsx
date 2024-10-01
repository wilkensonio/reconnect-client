import React, { useState } from 'react';
import axios from 'axios';

function signup() {
  //Creates the objects for the inputs 
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); //Prevents default form submission 
    //Create the payload data to be sent to the backend 
    const signupPayload = {
        email: email, 
        password: password,
    };
    //Sending POST request to the FastAPI backend with signupPayload
    try {
      const response = await axios.post('http://localhost:8000/api/v1', signupPayload);
      setMessage('Signup successful!'); //Sends this message if request is successful
    } catch (error) { //If errors appear it will display the responses below
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
      <form onSubmit={handleSubmit}> {/*Submits the email and password to the FastAPI backend*/}
        <input
          type="text"
          placeholder="Email"
          value={email} 
          onChange={(e) => setemail(e.target.value)} //Updating the email state when the input changes
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} //Updating the password state when the input changes
        />
        <button type="submit">Signup</button>
      </form>
      {/*Dislpay the success or error message below the form*/}
      <p>{message}</p>
    </div>
  );
}

export default signup;
