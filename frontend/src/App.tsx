import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext.jsx';
import AuthForm from './components/AuthForm';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Création d'un thème personnalisé
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // bleu clair MUI
    },
    secondary: {
      main: '#43a047', // vert MUI
    },
    background: {
      default: '#f5f6fa', // fond très clair
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(AuthContext) as { token?: string };
  return context && context.token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            sx={{ backgroundColor: theme.palette.background.default }}
          >
            <Navbar />
            <Box
              component="main"
              flexGrow={1}
              display="flex"
              flexDirection="column"
              p={3}
              sx={{
                maxWidth: 1600,
                margin: '0 auto',
                width: '100%',
              }}
            >
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
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;