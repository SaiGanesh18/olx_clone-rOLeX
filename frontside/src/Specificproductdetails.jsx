import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import DialogBox from './Dialogbox';
import swal from 'sweetalert';

function Specificprod() {
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

    const handleOrderClick = (inputValue) => {

        HandleClick(products[0].productdata.productid, inputValue, userEmail, navigate);

    };

    return (
        <div>
            {userEmail ? <Navbar /> : null}
            <div>
                <h1 className="title">Product details</h1>
                {products.rows ? (
                    <Listalldetails array={products.rows} userEmail={userEmail} onOrderClick={handleOrderClick} />
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

function Listalldetails({ array, userEmail, onOrderClick }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    const handleSave = (value) => {
        setInputValue(value);
    };

    const handleOrderClick = () => {
        onOrderClick(inputValue);
    };

    return (
        <section className="cards">
            {array.map((element, index) => (
                <div className="card" key={index}>
                    <h1>Product : {element.productdata.pname}</h1>
                    <h1>Year of purchase : {element.productdata.yop}</h1>
                    <h1>Starting Price : {element.productdata.sprice}</h1>
                    <h1>Closing Price : {element.productdata.eprice}</h1>
                    <button type="button" onClick={openDialog}>Select value</button>
                    <p>Requested amount: {inputValue}</p>

                    <DialogBox isOpen={isDialogOpen} onClose={closeDialog} onSave={handleSave} />

                    <button type="button" onClick={handleOrderClick}>Place Order</button>
                </div>
            ))}
        </section>
    );
}

const HandleClick = async (productid, inputValue, userEmail, navigate) => {
    try {
        const bidprice = inputValue;
        const response = await fetch(`http://localhost:3000/bid/${productid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'userid': userEmail
            },
            body: JSON.stringify({ bidprice }),
        });

        const data = await response.json();
        if (response.ok) {
            swal({
                title: "Product posted",
                text: "success",
                icon: "success",
                button: "ok",
            });

            navigate("/products");
        }
        // Handle the response data
    } catch (error) {
        console.error('Network error:', error);
    }
};

export default Specificprod;






































/* import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import DialogBox from './Dialogbox';



function Specificprod() {
    const userEmail = localStorage.getItem("userid");
    const location = useLocation();
    const productid = location.state && location.state.productid; // Access the productid from the state

    const [products, setProducts] = useState([]);

    console.log(productid);
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
                //console.log(products.rows);

            } catch (error) {
                console.error('Network error:', error);
            }
        };

        fetchProducts();
    }, [userEmail]);



    useEffect(() => {
        if (!userEmail) {
            navigate("/"); // Navigate to the login page if userEmail is not present
        }
    }, [userEmail, navigate]);
    return (
        <div>
            {userEmail ? <Navbar /> : null}


            <div>
                <h1 className="title">Product details</h1>
                {products.rows ? (
                    <Listalldetails array={products.rows} />
                ) : (
                    <p>Loading...</p>
                )}
            </div>


        </div>
    );
}


function Listalldetails({ array }) {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');


    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    const handleSave = (value) => {
        setInputValue(value);
    };

    const handleOrderClick = () => {
        // Call the HandleClick function and pass the inputValue
        HandleClick(array[0].productdata.productid, inputValue, userEmail);
    };

    return (
        <section className="cards">
            {array.map((element, index) => (
                <div className="card">
                    <h1>Product : {element.productdata.pname}</h1>
                    <h1>Year of purchase : {element.productdata.yop}</h1>
                    <h1>starting Price : {element.productdata.sprice}</h1>
                    <h1>closing price : {element.productdata.eprice}</h1>
                    <button type="post" onClick={openDialog}>Order now</button>
                    <p>Requested amount: {inputValue}</p>

                    <DialogBox isOpen={isDialogOpen} onClose={closeDialog} onSave={handleSave} />
                    <HandleClick />
                </div>
                //<div key={index}>{element.name}</div>
            ))}
        </section>
    );
}

const HandleClick = async (productid, inputValue, userEmail) => {
    try {

        const response = await fetch(`http://localhost:3000/bid/$productid`, {
            method: 'POST',
            // Set the header with the desired value
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'userid': userEmail
            },
            body: JSON.stringify({ inputValue, userEmail }),
        });

        const data = await response.json();

    } catch (error) {
        console.error('Network error:', error);
    }

};
export default Specificprod;





*/