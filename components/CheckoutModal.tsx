import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { CloseIcon, CheckIcon } from './Icons';

interface CheckoutModalProps {
  isOpen: boolean;
  cart: Product[];
  onClose: () => void;
  onPurchaseComplete: () => void;
}

const calculateTotals = (cartItems: Product[]) => {
    const count = cartItems.length;
    if (count === 0) return { subtotal: 0, total: 0, discount: 0 };

    const basePrice = 10;
    const subtotal = count * basePrice;
    let total = subtotal;

    const fives = Math.floor(count / 5);
    const remainder = count % 5;

    let remainderPrice = 0;
    switch (remainder) {
        case 1: remainderPrice = 10; break;
        case 2: remainderPrice = 18; break;
        case 3: remainderPrice = 25; break;
        case 4: remainderPrice = 40; break;
    }
    
    total = fives * 40 + remainderPrice;
    
    const discount = subtotal - total;
    return { subtotal, total, discount };
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, cart, onClose, onPurchaseComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  
  const { subtotal, total, discount } = calculateTotals(cart);
  
  const isFormValid = name.trim() !== '' && email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsPaid(false);
        setName('');
        setEmail('');
      }, 300);
    }
  }, [isOpen]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsPaid(true);
  };
  
  const handleContinueShopping = () => {
    onPurchaseComplete();
    onClose();
  };

  const downloadProductFile = (product: Product) => {
    const fileContent = `Thank you for purchasing "${product.title}" from Father Dust's Thinkery.\n\nThis is your downloaded guide. In a real scenario, this file would contain the full PDF content.`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const OrderSummary = ({ isSuccessView }: {isSuccessView: boolean}) => (
      <div className={`bg-[hsl(var(--background))] p-5 rounded-lg mb-6 ${isSuccessView ? 'text-left' : ''}`}>
          <h3 className="text-lg font-semibold mb-4">{isSuccessView ? 'Order Details' : 'Order Summary'}</h3>
          <div className="space-y-2 text-sm">
              {cart.map(item => (
                  <div key={item.id} className="flex justify-between">
                      <span className="truncate pr-4">{item.emoji} {item.title}</span>
                      <span>${item.price.toFixed(2)}</span>
                  </div>
              ))}
              {discount > 0 && (
                  <div className="flex justify-between text-[hsl(var(--success))] font-semibold">
                      <span>Bundle Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                  </div>
              )}
          </div>
          <div className="flex justify-between pt-4 mt-4 border-t-2 border-[hsl(var(--border))] text-xl font-bold">
              <span>{isSuccessView ? 'Total Paid:' : 'Total:'}</span>
              <span>${total.toFixed(2)}</span>
          </div>
      </div>
  );

  return (
    <div className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-[hsl(var(--surface))] rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'} border-2 border-[hsl(var(--primary))]`}>
        <div className="p-6 border-b border-[hsl(var(--border))] flex justify-between items-center sticky top-0 bg-[hsl(var(--surface))] z-10">
          <h2 className="text-2xl font-bold">{isPaid ? 'Order Confirmed' : 'Checkout'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 md:p-8">
            {!isPaid ? (
                <form onSubmit={handlePayment}>
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="customerName">Full Name *</label>
                            <input type="text" id="customerName" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--surface))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:outline-none"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="customerEmail">Email Address *</label>
                            <input type="email" id="customerEmail" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--surface))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:outline-none"/>
                        </div>
                    </div>
                    <OrderSummary isSuccessView={false} />
                    <button type="submit" disabled={!isFormValid} className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-3 px-4 rounded-lg font-semibold text-lg transition-transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100">
                        Pay with PayPal - ${total.toFixed(2)}
                    </button>
                </form>
            ) : (
                <div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-[hsl(var(--primary))] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckIcon className="w-12 h-12 text-[hsl(var(--primary))]" />
                      </div>
                      <h2 className="text-3xl font-bold text-[hsl(var(--primary))] mb-2">Order Confirmed!</h2>
                      <p className="text-[hsl(var(--foreground))] text-opacity-70 mb-4">
                          Thank you, <strong>{name}</strong>! Your guides are ready for download.
                      </p>
                       <p className="text-xs text-opacity-50 mb-6">A confirmation has been sent to <strong>{email}</strong>.</p>
                    </div>

                    <div className="bg-[hsl(var(--background))] p-4 rounded-lg mb-6 space-y-3">
                        <h3 className="font-semibold text-lg mb-2">Your Downloads</h3>
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between items-center bg-[hsl(var(--surface))] p-3 rounded-md">
                            <span className="truncate pr-4 text-sm">{item.emoji} {item.title}</span>
                            <button onClick={() => downloadProductFile(item)} className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs font-bold py-1 px-3 rounded-md hover:scale-105 transition-transform">DOWNLOAD</button>
                          </div>
                        ))}
                    </div>
                    
                    <button onClick={handleContinueShopping} className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-3 px-4 rounded-lg font-semibold text-lg transition-transform hover:scale-105">
                        Continue Shopping
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;