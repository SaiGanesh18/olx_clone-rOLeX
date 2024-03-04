import React, { useState, useEffect } from "react";
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export const Buystatus = () => {
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
                const response = await fetch(`http://localhost:3000/bidstatus/${productid}`, options);

                if (!response.ok) {
                    throw new Error('Failed to fetch product data');
                }

                const data = await response.json();
                setProducts(data);

                data.rows.forEach(row => {
                    if (row.bidstatus === 2) {
                        swal({
                            title: "Purchase successfull",
                            text: "success",
                            icon: "success",
                            button: "ok",
                        });
                    } else if (row.bidstatus === 1) {
                        swal({
                            title: "Purchase failed",
                            text: "failed",
                            icon: "error",
                            button: "ok",
                        });
                    } else {
                        swal({
                            title: "Purchase on progress",
                            text: "pending",
                            icon: "info",
                            button: "ok",
                        });
                    }
                });

                navigate("/buyhistory");
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
