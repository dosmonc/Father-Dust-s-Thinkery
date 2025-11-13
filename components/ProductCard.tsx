import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const generateKeywords = (title: string) => {
    const commonWords = ['a', 'an', 'the', 'is', 'in', 'on', 'how', 'to', 'and', 'for', 'of', 'your', 'with', 'own', 'he\'s', 'from', 'at', 'night', 'everyone'];
    const keywords = title
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(' ')
      .filter(word => !commonWords.includes(word) && word.length > 2)
      .slice(0, 3)
      .join(',');
    return keywords || 'abstract';
};


const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const keywords = product.imageKeywords || generateKeywords(product.title);
  const imageUrl = product.coverImageUrl || `https://source.unsplash.com/400x300/?${keywords}`;

  return (
    <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--card-border))] rounded-xl p-6 transition-all duration-300 ease-out flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[hsl(var(--primary))]">
      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-800">
        <img 
          src={imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ filter: 'grayscale(0.3) contrast(1.1) brightness(0.9) saturate(1.2)' }}
        />
      </div>
      <h3 className="text-lg font-semibold mb-3 text-white">{product.title}</h3>
      <p className="text-sm text-gray-400 mb-4 flex-grow">{product.description}</p>
      <div className="flex justify-between items-center mb-4 pt-3 border-t border-[hsl(var(--card-border))]">
        <span className="text-2xl font-bold text-[hsl(var(--primary))]">${product.price.toFixed(2)}</span>
        <span className="text-xs text-[hsl(var(--foreground))] text-opacity-60">{product.pages} pages</span>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => onAddToCart(product)}
          className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-2 px-4 rounded-lg font-medium transition-transform hover:scale-105"
        >
          Add to Cart
        </button>
        <button 
          onClick={() => onViewDetails(product)}
          className="w-full border border-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] py-2 px-4 rounded-lg font-medium transition-colors hover:bg-[hsl(var(--secondary))]"
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;