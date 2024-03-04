import React, { useState } from "react";
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs';


export const Login = (props) => {
    const [useremail, setEmail] = useState('');
    const [userpassword, setPass] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        //const hasheduserpassword = bcrypt.hashSync(userpassword, 10);
        const userData = { useremail, userpassword };

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            //const data = await response.json();
            //  console.log(data);
            if (response.ok) {
                swal({
                    title: "Login success",
                    text: "success",
                    icon: "success",
                    button: "ok",
                });
                localStorage.setItem("userid", useremail);
                navigate("/products"); // Replace with your home page route
            }
            else {
                swal({
                    title: "Invalid Credentials",
                    text: "try again",
                    icon: "error",
                    button: "ok",
                });
            }

            //else {
            //  console.log('Unexpected error:', data.message);

            // }

        }
        catch (error) {
            console.error('Network error:', error);
        }

    }

    return (
        <div>
            <div className="header">
                <h1 className="headertitle">rOLeX</h1>
                <p className="headerpara">Connect with people and start shopping.</p>
            </div>
            <div className="auth-form-container">
                <h2>Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="a" htmlFor="email">Email</label>
                    <input className="s" value={useremail} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email" id="email" name="email" required />
                    <label className="a" htmlFor="password">Password</label>
                    <input className="s" value={userpassword} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" required /><br></br>
                    <button className="link-btn" type="submit">Log In</button> <br></br>
                </form>
                <button className="switch" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>
            </div>
        </div>
    )
}