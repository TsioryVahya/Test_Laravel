
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
// @ts-ignore
import { AuthContext } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(AuthContext as React.Context<any>) as any;

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (e) {
        if (e instanceof Error) {
            setError(`Failed to fetch products: ${e.message}.`);
        } else {
            setError('An unknown error occurred.');
        }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
        fetchProducts();
    }
  }, [token]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product.');
      }

      // Re-fetch products after deletion
      fetchProducts(); 
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center text-white py-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Our Products</h1>
            <Link to="/products/create" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                Create New Product
            </Link>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
