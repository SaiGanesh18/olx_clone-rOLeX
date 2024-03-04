import React, { useState, useEffect } from "react";
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export const Sellstatus = () => {
    const location = useLocation();
    const productid = location.state && location.state.productid;
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
                const response = await fetch(`http://localhost:3000/productstatus/${productid}`, options);

                if (!response.ok) {
                    throw new Error('Failed to fetch product data');
                }

                const data = await response.json();
                setProducts(data);

                data.rows.forEach(row => {
                    if (row.productstatus === 1) {
                        swal({
                            title: "Product sold",
                            text: "success",
                            icon: "success",
                            button: "ok",
                        });
                    } else {
                        swal({
                            title: "Product is yet to be sold",
                            text: "pending",
                            icon: "info",
                            button: "ok",
                        });
                    }
                });

                navigate("/sellhistory");
            } catch (error) {
                console.error('Network error:', error);
            }
        };

        fetchProducts();
    }, [userEmail]);

    useEffect(() => {
        if (!userEmail) {
            navigate("/");
        }
    }, [userEmail, navigate]);

    return (
        <div>
            {userEmail ? <Navbar /> : null}
        </div>
    );
}