import React from 'react';
import { Product } from '../types';
import { CloseIcon, CartIcon } from './Icons';

interface CartSidebarProps {
  isOpen: boolean;
  cart: Product[];
  onClose: () => void;
  onRemoveFromCart: (productId: number) => void;
  onCheckout: () => void;
}

const generateKeywords = (title: string) => {
    const commonWords = ['a', 'an', 'the', 'is', 'in', 'on', 'how', 'to', 'and', 'for', 'of', 'your', 'with', 'own', 'he\'s', 'from', 'at', 'night', 'everyone'];
    const keywords = title
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(' ')
      .filter(word => !commonWords.includes(word) && word.length > 2)
      .slice(0, 2)
      .join(',');
    return keywords || 'abstract';
};

const calculateTotals = (cartItems: Product[]) => {
    const masterGuide = cartItems.find(item => item.id === 0);
    const standardGuides = cartItems.filter(item => item.id !== 0);

    const standardGuidesCount = standardGuides.length;
    let standardGuidesSubtotal = 0;
    let standardGuidesTotal = 0;
    let message = '';

    if (standardGuidesCount > 0) {
        const basePrice = 10;
        standardGuidesSubtotal = standardGuidesCount * basePrice;

        const fives = Math.floor(standardGuidesCount / 5);
        const remainder = standardGuidesCount % 5;

        let remainderPrice = 0;
        switch (remainder) {
            case 1: remainderPrice = 10; break;
            case 2: remainderPrice = 18; break;
            case 3: remainderPrice = 25; break;
            case 4: remainderPrice = 40; break;
        }
        
        standardGuidesTotal = fives * 40 + remainderPrice;
        const standardGuidesDiscount = standardGuidesSubtotal - standardGuidesTotal;

        if (standardGuidesCount === 1) message = 'Add 1 more for just $8!';
        else if (standardGuidesCount === 2) message = 'Add 1 more for just $7!';
        else if (standardGuidesCount === 3) message = 'Add 1 more for just $15!';
        else if (standardGuidesCount === 4) message = 'Add 1 more & get the 5th for FREE!';
        else if (standardGuidesDiscount > 0) message = `🎉 You saved $${standardGuidesDiscount.toFixed(2)} with bundle deals!`;
    }

    const masterGuidePrice = masterGuide ? masterGuide.price : 0;
    
    const subtotal = standardGuidesSubtotal + masterGuidePrice;
    const total = standardGuidesTotal + masterGuidePrice;
    const discount = subtotal - total;
    
    if (masterGuide && standardGuidesCount > 0) {
        message = "Master Guide added! Bundle discounts apply to other guides."
    } else if (masterGuide) {
        message = "You've unlocked the entire library! 💎"
    }

    if (cartItems.length === 0) return { subtotal: 0, total: 0, discount: 0, message: '' };

    return { subtotal, total, discount, message };
};


const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, cart, onClose, onRemoveFromCart, onCheckout }) => {
  const { subtotal, total, discount, message } = calculateTotals(cart);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      <aside className={`fixed top-0 right-0 w-full max-w-md h-full bg-[hsl(var(--surface))] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col border-l-2 border-[hsl(var(--primary))]`}>
        <div className="p-6 border-b border-[hsl(var(--border))] flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Your Cart</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center text-[hsl(var(--foreground))] text-opacity-70 mt-16">
              <CartIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 p-4 bg-[hsl(var(--background))] rounded-lg">
                  <div className="w-16 h-16 flex items-center justify-center rounded-md overflow-hidden bg-gray-800">
                    <img src={item.coverImageUrl || `https://source.unsplash.com/100x100/?${item.imageKeywords || generateKeywords(item.title)}`} alt={item.title} className="w-full h-full object-cover" style={{ filter: 'grayscale(0.3) contrast(1.1) brightness(0.9) saturate(1.2)' }}/>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-white">{item.title}</h3>
                    <p className="text-[hsl(var(--primary))] font-bold mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => onRemoveFromCart(item.id)} className="text-[hsl(var(--primary))] hover:text-red-400 text-xs self-start font-semibold">REMOVE</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]">
            <div className="bg-green-500/10 text-white p-3 rounded-lg mb-4 text-center text-sm font-medium border border-green-500/20">
                {message}
            </div>
            {discount > 0 && (
               <div className="flex justify-between text-sm text-gray-400 mb-2 line-through">
                <span>Original Total:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold mb-4 text-white">
              <span>Total:</span>
              <span className="text-white">${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-3 px-4 rounded-lg font-semibold text-lg transition-transform hover:scale-105"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;