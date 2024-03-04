import React, { useState, useEffect } from "react";
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";


//import './Postproduct.css';
import Navbar from './Navbar';

export const Sellhistory = () => {

    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userid');
    const [products, setProducts] = useState([]);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const headers = new Headers();
                headers.append('userid', userEmail);

                const options = {
                    method: 'GET',
                    headers: headers,
                };

                const response = await fetch('http://localhost:3000/sell/history', options);

                if (!response.ok) {
                    throw new Error('Failed to fetch product data');
                }

                const data = await response.json();
                setProducts(data);


            } catch (error) {
                console.error('Network error:', error);
            }
        };

        fetchProducts();
    }, [userEmail]);


    useEffect(() => {
        if (!userEmail) {
            navigate('/');
        }
    }, [userEmail, navigate]);

    return (
        <div>
            <div>
                {userEmail ? <Navbar /> : null}

                <div>
                    <h1 className="title">Sell history</h1>
                    {products.rows ? (
                        <Listalldetails array={products.rows} />
                    ) : (
                        <p>Loading...</p>
                    )}
                    {products.rows && products.rows.length === 0 && <p className="not">No products found</p>}

                </div>
            </div>
        </div>
    );
}

function Listalldetails({ array }) {

    const navigate = useNavigate(); // Get the navigate function


    const handleClick = (productid) => {
        navigate('/totalrequests', { state: { productid: productid } });
    };


    const viewStatus = (productid) => {
        navigate('/sellstatus', { state: { productid: productid } });
    };

    return (
        <section className="cards">
            {array.map((element, index) => (
                <div className="card">
                    <h1>Product : {element.productdata.pname}</h1>
                    <h1>Year of purchase : {element.productdata.yop}</h1>
                    <h1>starting Price : {element.productdata.sprice}</h1>
                    <h1>closing price : {element.productdata.eprice}</h1>
                    <button className="postButton" type="submit" onClick={() => handleClick(element.productid)}>View all requests</button>
                    <button className="postButton" type="submit" onClick={() => viewStatus(element.productid)}>View status</button>


                </div>
                //<div key={index}>{element.name}</div>
            ))}
        </section>
    );
}


//<button type="submit" onClick={() => handleClick(element.productid)}>More details</button>
