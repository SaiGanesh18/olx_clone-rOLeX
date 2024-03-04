import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import swal from 'sweetalert';

function Totalrequests() {
    const userEmail = localStorage.getItem("userid");
    const location = useLocation();
    const productid = location.state && location.state.productid;

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const headers = new Headers();
                headers.append('userid', userEmail);

                const options = {
                    method: 'GET',
                    headers: headers,
                };

                const response = await fetch(`http://localhost:3000/allbids/${productid}`, options);

                const data = await response.json();
                setProducts(data);
                console.log(data);

            } catch (error) {
                console.error('Network error:', error);
            }
        };

        fetchProducts();
    }, [productid, userEmail]);

    useEffect(() => {
        if (!userEmail) {
            navigate("/");
        }
    }, [userEmail, navigate]);

    return (
        <div>
            {userEmail ? <Navbar /> : null}
            <div>
                <h1 className="title">All requests</h1>
                {products.rows ? (
                    <Listalldetails array={products.rows} userEmail={userEmail} />
                ) : (
                    <p>Loading...</p>
                )}
                {products.rows && products.rows.length === 0 && <p className="not">No requests</p>}

            </div>
        </div>
    );
}

function Listalldetails({ array, userEmail }) {

    const navigate = useNavigate(); // Get the navigate function

    // Define HandleClick here as a callback function
    const HandleClick = async (bidid) => {
        try {
            const headers = new Headers();
            headers.append('userid', userEmail);

            const options = {
                method: 'POST',
                headers: headers,
            };

            const response = await fetch(`http://localhost:3000/bid/accept/${bidid}`, options);

            if (!response.ok) {
                throw new Error('Failed to fetch product data');
            }

            //const data = await response;
            if (response.ok) {
                swal({
                    title: "Request Accepted",
                    text: "success",
                    icon: "success",
                    button: "ok",
                });
                navigate('/products');
            }

        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <section className="cards">
            {array.map((element, index) => (
                <div className="card" key={index}>
                    <h1>Buyer email : {element.buyeremail}</h1>
                    <h1>Requested Price : {element.bidprice}</h1>
                    <button className="postButton" type="button" onClick={() => HandleClick(element.bidid)}>Accept offer</button>
                </div>
            ))}
        </section>
    );
}

export default Totalrequests;
