import React, { useState, useEffect } from "react";
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";

//import './Postproduct.css';
import Navbar from './Navbar';


export const Postproduct = () => {
    const [pname, setPname] = useState('');
    const [sprice, setSprice] = useState('');
    const [eprice, setEprice] = useState('');
    const [yop, setYop] = useState('');


    const navigate = useNavigate();
    const userEmail = localStorage.getItem("userid");


    const handleSubmit = async (e) => {
        e.preventDefault();


        const userData = {
            pname: pname,
            sprice: sprice,
            eprice: eprice,
            yop: yop
        };

        if (parseFloat(eprice) < parseFloat(sprice)) {
            swal({
                title: "Invalid Input",
                text: "Ending price cannot be less than starting price",
                icon: "error",
                button: "ok",
            });
            return;
        }

        if (parseFloat(sprice) < 0) {
            swal({
                title: "Invalid Input",
                text: "Starting price cannot be negative",
                icon: "error",
                button: "ok",
            });
            return;
        }

        if (parseFloat(eprice) < 0) {
            swal({
                title: "Invalid Input",
                text: "Ending price cannot be negative",
                icon: "error",
                button: "ok",
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/product', {
                method: 'POST',
                // Set the header with the desired value
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'userid': userEmail
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                swal({
                    title: "Product posted",
                    text: "success",
                    icon: "success",
                    button: "ok",
                });
                navigate("/products"); // Replace with your home page route
            }
            else if (response.status === 401) {

            } else {
                console.log('Unexpected error:', data.message);
            }

        } catch (error) {
            console.error('Network error:', error);
        }

    }

    useEffect(() => {
        if (!userEmail) {
            navigate("/"); // Navigate to the login page if userEmail is not present
        }
    }, [userEmail, navigate]);
    return (
        <div>
            <div>
                {userEmail ? <Navbar /> : null}
            </div>
            <div className="auth-form-container">
                <h2>Post your Product here</h2>
                <form className="register-form" onSubmit={handleSubmit}>
                    <label htmlFor="name">Product Name</label>
                    <input className="s" value={pname} onChange={(e) => setPname(e.target.value)} placeholder="product name" id="pname" name="pname" required />

                    <label htmlFor="number">Starting price</label>
                    <input className="s" value={sprice} onChange={(e) => setSprice(e.target.value)} placeholder="starting price" id="sprice" name="sprice" required />

                    <label htmlFor="number">Ending Price</label>
                    <input className="s" min={sprice} value={eprice} onChange={(e) => setEprice(e.target.value)} placeholder="ending price" id="eprice" name="eprice" required />

                    <label htmlFor="year">Year of purchase</label>
                    <input type="number" className="s" min="1" max="2023" value={yop} onChange={(e) => setYop(e.target.value)} placeholder="year of purchase" id="yop" name="yop" required /><br></br>

                    <button className="postButton" type="submit">Post</button>

                </form>
            </div>
        </div>
    );
}