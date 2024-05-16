import React, { createContext, useContext, useState } from 'react';

// Create a context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that encapsulates your application
export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));

    const login = (token) => {
        localStorage.setItem('userToken', token);
        setUserToken(token);
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        setUserToken(null);
    };

    return (
        <AuthContext.Provider value={{ userToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
