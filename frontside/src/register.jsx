import React, { useState } from "react";
import swal from 'sweetalert';
import bcrypt from 'bcryptjs';


export const Register = (props) => {
    const [useremail, setEmail] = useState('');
    const [userpassword, setPass] = useState('');
    const [username, setName] = useState('');
    const [userphonenumber, setNum] = useState('');
    const [useraddress, setAddress] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const hasheduserpassword = bcrypt.hashSync(userpassword, 10);
        const userData = { useremail, hasheduserpassword, username, userphonenumber, useraddress };

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json;

            if (response.ok) {
                swal({
                    title: "Registration success",
                    text: "success",
                    icon: "success",
                    button: "ok",
                });
                //console.log('Login successful:', data.message);
            }
            else if (response.status === 401) {
                swal({
                    title: "user already exists",
                    text: "try again",
                    icon: "error",
                    button: "ok",
                });
                //console.log('Invalid credentials:', data.message);
                // Handle invalid credentials case
            } else {
                console.log('Unexpected error:', data.message);
                // Handle other error cases
            }

        } catch (error) {
            console.error('Network error:', error);
        }
    }

    return (
        <div className="auth-form-container">
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <label className="a" htmlFor="email">Email</label>
                <input className="s" value={useremail} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email" id="email" name="email" required />
                <label className="a" htmlFor="password">Password</label>
                <input className="s" value={userpassword} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" required />
                <label className="a" htmlFor="name">Username</label>
                <input className="s" value={username} name="name" onChange={(e) => setName(e.target.value)} id="name" placeholder="username" required />
                <label className="a" htmlFor="phonenumber">Phone Number</label>
                <input className="s" value={userphonenumber} name="number" onChange={(e) => setNum(e.target.value)} id="number" placeholder="phonenumber" required />

                <label className="a" htmlFor="address">Address</label>
                <input className="s" value={useraddress} name="number" onChange={(e) => setAddress(e.target.value)} id="address" placeholder="address" required />

                <button className="link-btn" type="submit">Register</button>
            </form>
            <button className="switch" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here.</button>
        </div>
    )
}