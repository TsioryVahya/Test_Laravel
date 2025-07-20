
import React from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

const ProductCard: React.FC<{ product: Product; onDelete: (id: number) => void; }> = ({ product, onDelete }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col">
      <img className="w-full h-56 object-cover object-center" src={product.image_url ? `http://localhost:8000${product.image_url}` : 'https://via.placeholder.com/400x300'} alt={product.name} />
      <div className="p-6 flex-grow flex flex-col">
        <h2 className="text-xl font-semibold text-white mb-2">{product.name}</h2>
        <p className="text-gray-400 text-base mb-4 flex-grow">{product.description}</p>
        <div className="text-2xl font-bold text-green-400 mb-4">${product.price}</div>
        <div className="flex justify-between items-center mt-auto">
            <Link to={`/products/${product.id}/edit`} className="text-sm bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Edit
            </Link>
            <button onClick={() => onDelete(product.id)} className="text-sm bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Delete
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
