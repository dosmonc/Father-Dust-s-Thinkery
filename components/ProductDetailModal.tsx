import React from 'react';
import { Product } from '../types';
import { CloseIcon } from './Icons';

interface ProductDetailModalProps {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
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

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, product, onClose, onAddToCart }) => {
  const keywords = product.imageKeywords || generateKeywords(product.title);
  const imageUrl = product.coverImageUrl || `https://source.unsplash.com/500x400/?${keywords}`;

  const handleAddToCartClick = () => {
    onAddToCart(product);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-[hsl(var(--surface))] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} border-2 border-[hsl(var(--secondary))]`}>
        <div className="p-6 border-b border-[hsl(var(--border))] flex justify-between items-center sticky top-0 bg-[hsl(var(--surface))] z-10">
          <h2 className="text-xl font-bold truncate pr-4">{product.title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 md:p-8">
            <div className="md:flex md:gap-8">
                <div className="md:w-1/2 mb-6 md:mb-0">
                    <div className="w-full h-auto bg-gray-800 rounded-lg">
                        <img 
                            src={imageUrl} 
                            alt={product.title} 
                            className="w-full h-auto object-cover rounded-lg"
                            style={{ filter: 'grayscale(0.3) contrast(1.1) brightness(0.9) saturate(1.2)' }}
                        />
                    </div>
                </div>
                <div className="md:w-1/2 flex flex-col">
                    <h3 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">{product.title}</h3>
                    <p className="text-[hsl(var(--foreground))] text-opacity-80 mb-6 flex-grow">{product.description}</p>
                    <div className="flex justify-between items-center mb-6 pt-4 border-t border-[hsl(var(--card-border))]">
                        <span className="text-3xl font-bold text-[hsl(var(--primary))]">${product.price.toFixed(2)}</span>
                        <span className="text-sm text-[hsl(var(--foreground))] text-opacity-60">{product.pages} pages</span>
                    </div>
                    <button 
                        onClick={handleAddToCartClick}
                        className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-3 px-4 rounded-lg font-semibold text-lg transition-transform hover:scale-105"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;