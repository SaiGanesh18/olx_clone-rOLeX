import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Home.css';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [specificpid, setSpecificpid] = useState('');

    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userid');
    //const [specificpid, setSpecificpid] = useState('');


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const headers = new Headers();
                headers.append('userid', userEmail);

                const options = {
                    method: 'GET',
                    headers: headers,
                };

                const response = await fetch('http://localhost:3000/products', options);

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
            {userEmail && <Navbar />}

            <div>
                <h1 className="title">Product List</h1>
                {products.rows ? (
                    <Listalldetails array={products.rows} />
                ) : (
                    <p>Loading...</p>
                )}
                {products.rows && products.rows.length === 0 && <p className="not">No products found</p>}
            </div>
        </div>
    );
}

//const [specificpid, setSpecificpid] = useState('');

//const handleClick = (productid) => {
//    navigate('/Specificproductdetails', { state: { 'productid': productid } });
//};

function Listalldetails({ array }) {
    const navigate = useNavigate(); // Get the navigate function

    const handleClick = (productid) => {
        navigate('/bidproduct', { state: { productid: productid } });
    };

    return (
        <section className="cards">
            {array.map((element, index) => (
                <div className="card">
                    <h1>Product : {element.productdata.pname}</h1>
                    <h1>Year of purchase : {element.productdata.yop}</h1>
                    <h1>starting Price : {element.productdata.sprice}</h1>
                    <h1>closing price : {element.productdata.eprice}</h1>

                    <button className="postButton" type="submit" onClick={() => handleClick(element.productid)}>More details</button>

                </div>
                //<div key={index}>{element.name}</div>
            ))}
        </section>
    );
}

function HomePage() {
    return (
        <div>
            <ProductList />
        </div>
    );
}

export default HomePage;


































































/* import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function ProductList() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userid');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const headers = new Headers();
                headers.append('userid', userEmail); // Replace with your actual token

                const options = {
                    method: 'GET',
                    headers: headers,
                };
                const response = await fetch('http://localhost:3000/products', options);

                console.log('sai');
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
    }, []);


    const array = products.rows;

    useEffect(() => {
        if (!userEmail) {
            navigate('/'); // Navigate to the login page if userEmail is not present
        }
    }, [userEmail, navigate]);

    return (
        <div>
            <div>{userEmail ? <Navbar /> : null}</div>

            <div>
                <h1>Product List</h1>
                <ul>
                    <Listalldetails productsArray={array} />
                </ul>
            </div>
        </div>
    );
}

function Listalldetails({ array }) {
    return (
        <section>
            {array.map((element) => {
                return 'hello';
            })}
        </section>
    );
}


function HomePage() {
    return (
        <div>
            <ProductList />
        </div>
    );
}

export default HomePage;


*/