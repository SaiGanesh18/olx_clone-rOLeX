import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import swal from 'sweetalert';

import './Bidproduct.css';
function Bidproduct(props) {
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

                const response = await fetch(`http://localhost:3000/products/${productid}`, options);

                const data = await response.json();
                setProducts(data);

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
                <h1 className="title">Product details</h1>
                {products.rows ? (
                    <Listalldetails array={products.rows} productid={productid} />
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}


function Listalldetails({ array, productid }) {

    const [bidprice, setBidPrice] = useState('');
    const navigate = useNavigate(); // Get the navigate function

    const handleBidSubmit = async (event) => {
        event.preventDefault();

        try {
            console.log(productid);
            const headers = new Headers();
            const userEmail = localStorage.getItem("userid");

            headers.append('userid', userEmail);
            headers.append('bidprice', bidprice);

            const options = {
                method: 'POST',
                headers: headers,
                //body: JSON.stringify({ "bidprice": bidprice })
            };

            //console.log(JSON.stringify({ "bidprice": bidprice }));
            const response = await fetch(`http://localhost:3000/bid/${productid}`, options);

            const data = await response.json();

            if (response.ok) {
                swal({
                    title: "Product requested",
                    text: "success",
                    icon: "success",
                    button: "ok",
                });
                navigate("/products"); // Replace with your home page route
            }

        } catch (error) {
            console.error('Network error:', error);
        }

    };

    useEffect(() => {
        if (bidprice === 'someValue') {
            // Use the navigate function when bidprice reaches a certain value
            navigate('/bid-success'); // Replace with your desired route
        }
    }, [bidprice, navigate]);
    return (
        <section className="cards">
            {array.map((element, index) => (
                <div className="card" key={index}>
                    <h1>Product : {element.productdata.pname}</h1>
                    <h1>Year of purchase : {element.productdata.yop}</h1>
                    <h1>Starting Price : {element.productdata.sprice}</h1>
                    <h1>Closing Price : {element.productdata.eprice}</h1>

                    <div className="align">
                        <form onSubmit={(e) => handleBidSubmit(e, element.productdata.productId)}>
                            <input
                                type="number"
                                className="ip"
                                value={bidprice}
                                onChange={(e) => setBidPrice(e.target.value)}
                                placeholder="Enter"
                                required
                                min={element.productdata.sprice}
                                max={element.productdata.eprice}

                            />
                            <button className="postButton" type="submit">Place Bid</button>
                        </form>
                    </div>

                </div>
            ))}
        </section>
    );
}


//<form>
//                       <input type="number" value={bidprice} onChange={(e) => setBidPrice(e.target.value)} />
//                  </form>
//

//                  <button type="button" onClick={handleOrderClick}>Place Order</button>
//console.log(bidprice);

export default Bidproduct;

//onOrderClick={handleOrderClick}