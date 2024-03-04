import { useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('userid');
        navigate('/');
    }, [navigate]);

    return null; // or a loading indicator, since this component doesn't render anything
}

export default Logout;