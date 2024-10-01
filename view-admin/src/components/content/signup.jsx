import React, { useState } from "react";

const Signup = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        const signupPayload = {
            email: email,
            password: password,
        };
        try {
            const response = await fetch('http://localhost:8000/api/v1/signup/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(signupPayload),
            });
            if (response.ok){
                const data = await response.json();
                setMessage(`Sucess: ${data.message}`);
            }
            else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.detail}`);
            }
            } catch (error) {
            setMessage('Error connecting to the server.');
          }
        };
    return(
        <div class="position-absolute top-50 start-50 translate-middle">
            <h1>Signup Page</h1>
            <form onSubmit={handleSubmit}>
                <label for="email">Email:</label><br/>
                <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <br></br><br></br>
                <label for="password">Password:</label><br/>
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <br></br><br></br>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Signup