
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Stack, Box } from '@mui/material';

const Navbar: React.FC = () => {
  const { token, logout } = useContext(AuthContext as React.Context<any>) as any;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/products" color="inherit" sx={{ textDecoration: 'none', fontWeight: 700 }}>
          KandraShop
        </Typography>
        <Stack direction="row" spacing={2}>
          {token ? (
            <Button color="inherit" onClick={handleLogout} variant="outlined" sx={{ bgcolor: 'white', color: 'primary.main', borderColor: 'primary.main', '&:hover': { bgcolor: 'primary.light', color: 'white' } }}>
              Déconnexion
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" variant="outlined" sx={{ bgcolor: 'white', color: 'primary.main', borderColor: 'primary.main', '&:hover': { bgcolor: 'primary.light', color: 'white' } }}>
                Connexion
              </Button>
              <Button color="inherit" component={Link} to="/register" variant="contained" sx={{ bgcolor: 'secondary.main', color: 'white', '&:hover': { bgcolor: 'secondary.dark' } }}>
                Inscription
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
