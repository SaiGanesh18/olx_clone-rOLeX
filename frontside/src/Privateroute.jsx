import React from 'react';
import { Route, Navigate } from 'react-router-dom';

function PrivateRoute({ element, ...rest }) {
    const isAuthenticated = localStorage.getItem("userEmail");

    return (
        <Route
            {...rest}
            element={isAuthenticated ? element : <Navigate to="/login" replace />}
        />
    );
}

export default PrivateRoute;

