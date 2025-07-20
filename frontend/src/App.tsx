
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// @ts-ignore
import { AuthContext, AuthProvider } from './context/AuthContext';
// @ts-ignore
import AuthForm from './components/AuthForm';
import ProductList from './components/ProductList';
// @ts-ignore
import ProductForm from './components/ProductForm';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Box from '@mui/material/Box';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useContext(AuthContext as React.Context<any>) as any;
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Box minHeight="100vh" width="100vw" bgcolor="#18181b" display="flex" flexDirection="column">
          <Navbar />
          <Box component="main" flexGrow={1} display="flex" flexDirection="column">
            <Routes>
              <Route path="/login" element={<AuthForm type="login" />} />
              <Route path="/register" element={<AuthForm type="register" />} />
              <Route
                path="/products"
                element={
                  <PrivateRoute>
                    <ProductList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/products/create"
                element={
                  <PrivateRoute>
                    <ProductForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/products/:id/edit"
                element={
                  <PrivateRoute>
                    <ProductForm />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/products" />} />
            </Routes>
          </Box>
        </Box>
        <ToastContainer theme="dark" />
      </AuthProvider>
    </Router>
  );
};

export default App;
