import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage on initial load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');

    if (storedToken && storedUser && storedRole) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
  }, []);

  const loginContext = (userData, authToken) => {
    setToken(authToken);
    setUser(userData);
    setRole(userData.role);

    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userData.role);

    // Redirect based on role
    if (userData.role === 'admin') navigate('/admin/dashboard');
    else if (userData.role === 'organizer') navigate('/organizer/dashboard');
    else if (userData.role === 'attender') navigate('/attender/dashboard');
    else navigate('/');
  };

  const logoutContext = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};
