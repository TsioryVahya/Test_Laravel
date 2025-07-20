import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { TextField, Button, Box, Typography, Paper, CircularProgress } from '@mui/material';
import { API_URL } from '../apiConfig';

const AuthForm = ({ type }) => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                if (type === 'login') {
                    login(data.user, data.token);
                    toast.success('Connexion réussie !');
                } else {
                    navigate('/login');
                    toast.success('Inscription réussie !');
                }
            } else {
                toast.error(data.message || 'Une erreur est survenue');
            }
        } catch (error) {
            toast.error('Erreur réseau');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f6fa">
            <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h5" mb={2} color="primary" align="center">
                    {type === 'login' ? 'Connexion' : 'Créer un compte'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    {type === 'register' && (
                        <TextField
                            label="Nom"
                            type="text"
                            fullWidth
                            margin="normal"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    )}
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <TextField
                        label="Mot de passe"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    {type === 'register' && (
                        <TextField
                            label="Confirmer le mot de passe"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={formData.password_confirmation}
                            onChange={e => setFormData({ ...formData, password_confirmation: e.target.value })}
                            required
                        />
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Chargement...' : type === 'login' ? 'Se connecter' : "S'inscrire"}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default AuthForm;