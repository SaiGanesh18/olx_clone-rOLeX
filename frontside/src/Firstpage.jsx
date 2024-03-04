import { Login } from "./login";
import { Register } from "./register";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import swal from 'sweetalert';

import './Firstpage.css';

function Firstpage() {

    const userEmail = localStorage.getItem("userid");
    const navigate = useNavigate();


    useEffect(() => {
        if (userEmail) {
            navigate("/products"); // Navigate to the login page if userEmail is not present
        }
    }, [userEmail, navigate]);



    const [currentForm, setCurrentForm] = useState('login');

    const toggleForm = (formName) => {
        setCurrentForm(formName);
    }

    return (
        <div>
            <div>
                {userEmail ? null : null}
            </div>
            <div className="App">
                {
                    currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm} />
                }
            </div>
        </div>
    );
}

export default Firstpage;
