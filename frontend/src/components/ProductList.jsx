import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Card, CardContent, CardMedia, Typography, Button, Grid, Box, CircularProgress, Stack } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import { API_URL } from '../apiConfig';

const ProductList = () => {
    const { token } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deletingId, setDeletingId] = useState(null);

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/products?page=${page}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setProducts(data.data);
            setCurrentPage(data.current_page);
            setTotalPages(data.last_page);
        } catch (error) {
            toast.error('Erreur lors du chargement des produits');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
            setDeletingId(id);
            try {
                const response = await fetch(`${API_URL}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    showSnackbar('Produit supprimé !', 'success');
                    fetchProducts(currentPage);
                } else {
                    showSnackbar('Erreur lors de la suppression', 'error');
                }
            } catch (error) {
                showSnackbar('Erreur réseau', 'error');
            } finally {
                setDeletingId(null);
            }
        }
    };

    const handleExportCsv = async () => {
        try {
            const response = await fetch(`${API_URL}/api/products/export/csv`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'products.csv';
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('CSV téléchargé !');
        } catch (error) {
            toast.error('Erreur lors du téléchargement');
        }
    };

    return (
        <Box minHeight="100vh" bgcolor="#f5f6fa" py={6}>
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
            <Box maxWidth="lg" mx="auto" px={2} bgcolor="#f5f6fa" borderRadius={4} boxShadow={0}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" mb={4} gap={2}>
                    <Typography variant="h4" color="primary" fontWeight={700}>Mes Produits</Typography>
                    <Stack direction="row" spacing={2}>
                        <Button component={Link} to="/products/create" variant="contained" color="success">
                            Ajouter
                        </Button>
                        <Button onClick={handleExportCsv} variant="contained" color="primary">
                            Exporter CSV
                        </Button>
                    </Stack>
                </Stack>
                {loading && products.length === 0 ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                        <CircularProgress />
                    </Box>
                ) : loading ? (
                    <Grid container spacing={4}>
                        {[...Array(4)].map((_, i) => (
                            <Grid item xs={12} md={6} key={i}>
                                <Card elevation={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Skeleton variant="rectangular" height={200} />
                                    <CardContent>
                                        <Skeleton variant="text" width="60%" />
                                        <Skeleton variant="text" width="80%" />
                                        <Skeleton variant="text" width="40%" />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : products.length === 0 ? (
                    <Box textAlign="center" py={8}>
                        <Typography variant="h6" color="text.secondary">Aucun produit</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {products.map((product) => (
                            <Grid item xs={12} md={6} key={product.id}>
                                <Card elevation={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#fff' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={product.image_url ? `${API_URL}${product.image_url}` : 'https://via.placeholder.com/400x300'}
                                        alt={product.name}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" fontWeight={700} gutterBottom>{product.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                                        <Typography variant="subtitle1" color="success.main" fontWeight={600} mt={2}>
                                            ${product.price}
                                        </Typography>
                                    </CardContent>
                                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ p: 2 }}>
                                        <Button component={Link} to={`/products/${product.id}/edit`} variant="contained" color="primary">
                                            Modifier
                                        </Button>
                                        <Button onClick={() => handleDelete(product.id)} variant="contained" color="error" disabled={deletingId === product.id}>
                                            {deletingId === product.id ? <CircularProgress size={20} color="inherit" /> : 'Supprimer'}
                                        </Button>
                                    </Stack>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
                {/* Pagination améliorée */}
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={4}>
                    <Button
                        onClick={() => fetchProducts(currentPage - 1)}
                        disabled={currentPage === 1}
                        variant="outlined"
                        sx={{ minWidth: 40 }}
                    >
                        Précédent
                    </Button>
                    {[...Array(totalPages)].map((_, idx) => {
                        const page = idx + 1;
                        return (
                            <Button
                                key={page}
                                onClick={() => fetchProducts(page)}
                                variant={page === currentPage ? 'contained' : 'outlined'}
                                color={page === currentPage ? 'primary' : 'inherit'}
                                sx={{ minWidth: 40, fontWeight: page === currentPage ? 700 : 400, bgcolor: page === currentPage ? '#1976d2' : '#fff', color: page === currentPage ? '#fff' : '#1976d2', borderColor: '#1976d2', mx: 0.5 }}
                            >
                                {page}
                            </Button>
                        );
                    })}
                    <Button
                        onClick={() => fetchProducts(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        variant="outlined"
                        sx={{ minWidth: 40 }}
                    >
                        Suivant
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default ProductList;