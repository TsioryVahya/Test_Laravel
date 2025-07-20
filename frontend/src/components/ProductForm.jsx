import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { TextField, Button, Box, Typography, Paper, CircularProgress } from '@mui/material';
import { API_URL } from '../apiConfig';

const ProductForm = () => {
    const { token } = React.useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetch(`${API_URL}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setFormData(data))
                .catch(() => toast.error('Erreur lors du chargement du produit'));
        }
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formPayload = new FormData();
            formPayload.append('name', formData.name);
            formPayload.append('description', formData.description);
            formPayload.append('price', formData.price);
            if (imageFile) {
                formPayload.append('image', imageFile);
            }
            // Add _method field for PUT requests when using FormData
            if (id) {
                formPayload.append('_method', 'PUT');
            }
            const url = id
                ? `${API_URL}/api/products/${id}`
                : `${API_URL}/api/products`;
            const response = await fetch(url, {
                method: 'POST', // Always use POST for FormData with _method spoofing
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formPayload,
            });
            if (response.ok) {
                toast.success(id ? 'Produit modifié !' : 'Produit ajouté !');
                navigate('/products');
            } else {
                const data = await response.json();
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
                    {id ? 'Modifier le produit' : 'Ajouter un produit'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nom"
                        type="text"
                        fullWidth
                        margin="normal"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ mt: 2, mb: 1 }}
                    >
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={e => setImageFile(e.target.files[0])}
                        />
                    </Button>
                    {imageFile && <Typography variant="body2" sx={{ mb: 1 }}>{imageFile.name}</Typography>}
                    <TextField
                        label="Description"
                        multiline
                        rows={3}
                        fullWidth
                        margin="normal"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                    <TextField
                        label="Prix"
                        type="number"
                        step="0.01"
                        fullWidth
                        margin="normal"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Chargement...' : id ? 'Modifier' : 'Ajouter'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default ProductForm;
