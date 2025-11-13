import React, { useState, useCallback, useEffect } from 'react';
import { Product } from './types';
import { PRODUCTS } from './constants';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import CheckoutModal from './components/CheckoutModal';
import ProductDetailModal from './components/ProductDetailModal';
import { SparklesIcon } from './components/Icons';
import { generateImage } from './services/geminiService';

const App: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const [requestTopic, setRequestTopic] = useState('');
  const [requestResponse, setRequestResponse] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const generateCovers = async () => {
        // Process products sequentially with a delay to avoid hitting API rate limits.
        for (const [index, product] of PRODUCTS.entries()) {
            try {
                const prompt = product.imageKeywords || product.title;
                const imageUrl = await generateImage(prompt);
                setProductList(prevList => {
                    const newList = [...prevList];
                    newList[index] = { ...newList[index], coverImageUrl: imageUrl };
                    return newList;
                });
                // Add a small delay between successful API calls.
                await delay(1500);
            } catch (error) {
                console.error(`Failed to generate cover for "${product.title}":`, error);
                // If an error occurs, wait a bit longer before the next attempt.
                await delay(3000);
            }
        }
    };

    generateCovers();
  }, []);


  const handleAddToCart = useCallback((product: Product) => {
    setCart((prevCart) => {
      if (prevCart.find(item => item.id === product.id)) {
        return prevCart; // Prevent duplicates
      }
      return [...prevCart, product];
    });
    setIsCartOpen(true);
  }, []);

  const handleRemoveFromCart = useCallback((productId: number) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  }, []);

  const handleCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);
  
  const handlePurchaseComplete = useCallback(() => {
      setCart([]);
  }, []);

  const handleViewDetails = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  }, []);
  
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTopic.trim()) return;
    setIsSubmittingRequest(true);
    setRequestResponse("Preparing your email client...");

    const subject = encodeURIComponent("New Guide Request from Father Dust's Thinkery");
    const body = encodeURIComponent(`Hello Father Dust,\n\nI would like to request a new guide on the following topic:\n\n"${requestTopic}"\n\nThank you!`);
    window.location.href = `mailto:aiautoally@gmail.com?subject=${subject}&body=${body}`;
    
    setRequestTopic('');
    setTimeout(() => {
      setIsSubmittingRequest(false);
      setRequestResponse("Your request has been prepared for sending via your email app. Thanks for the idea!");
    }, 1500);
  };

  return (
    <div className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] min-h-screen font-sans">
      <Header cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />
      
      <main>
        <section className="hero" id="home">
            <div className="bg-gradient-to-br from-black to-gray-900/50 py-20 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Transform Your Life with Father Dust's Guides</h1>
                <p className="text-lg text-[hsl(var(--foreground))] text-opacity-70 max-w-2xl mx-auto mb-8">High-quality, hand-to-keyboard crafted PDF guides covering essential life skills, mental health, business, and personal development.</p>
                <div className="bundle-banner bg-[hsl(var(--surface))] border-2 border-[hsl(var(--primary))] rounded-xl p-6 max-w-3xl mx-auto shadow-lg shadow-pink-500/10">
                    <h3 className="text-[hsl(var(--primary))] text-xl font-bold mb-2">🎁 Special Bundle Offers</h3>
                    <p className="text-sm">Buy 1 for $10, 2 for $18, 3 for $25, or get 5 guides for just $40!</p>
                </div>
            </div>
        </section>

        <section className="products-section max-w-7xl mx-auto py-16 px-6" id="products">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Father Dust's Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productList.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails} 
              />
            ))}
          </div>
        </section>

        <section className="ai-tools-section bg-slate-900/30 py-20 px-6" id="ai-tools">
            <div className="max-w-4xl mx-auto text-center">
                <SparklesIcon className="w-12 h-12 mx-auto mb-4 text-[hsl(var(--primary))]" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Thinkery Tools</h2>
                <p className="text-[hsl(var(--foreground))] text-opacity-70 max-w-2xl mx-auto mb-12">Request new guides tailored to your needs.</p>
                
                <div className="text-left">
                    {/* Request a Guide */}
                    <div className="bg-[hsl(var(--surface))] p-8 rounded-xl shadow-lg border border-[hsl(var(--card-border))]">
                        <h3 className="text-2xl font-bold mb-4">Request a New Guide</h3>
                        <form onSubmit={handleRequestSubmit} className="space-y-4">
                            <input 
                                type="text"
                                value={requestTopic}
                                onChange={(e) => setRequestTopic(e.target.value)}
                                placeholder="What topic should we cover next?"
                                className="w-full p-3 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--surface))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:outline-none"
                            />
                            <button type="submit" disabled={isSubmittingRequest} className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-transform hover:scale-105 disabled:bg-gray-500 disabled:scale-100">
                                {isSubmittingRequest ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                        {requestResponse && (
                            <div className="mt-6 p-4 border border-purple-500/30 rounded-lg bg-purple-500/10 text-purple-300">
                               <p>{requestResponse}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
      </main>

      <footer className="footer bg-[hsl(var(--surface))] border-t border-[hsl(var(--border))] py-12 px-6 mt-16" id="contact">
          <div className="footer-content max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="footer-section">
                  <h4 className="font-semibold mb-4">About Father Dust's Thinkery</h4>
                  <p className="text-sm text-[hsl(var(--foreground))] text-opacity-70">Guides crafted for personal growth, mental health, and business success.</p>
              </div>
              <div className="footer-section">
                  <h4 className="font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                      <li><a href="#home" className="text-sm text-[hsl(var(--foreground))] text-opacity-70 hover:text-[hsl(var(--primary))]">Home</a></li>
                      <li><a href="#products" className="text-sm text-[hsl(var(--foreground))] text-opacity-70 hover:text-[hsl(var(--primary))]">Products</a></li>
                      <li><a href="#ai-tools" className="text-sm text-[hsl(var(--foreground))] text-opacity-70 hover:text-[hsl(var(--primary))]">AI Tools</a></li>
                  </ul>
              </div>
              <div className="footer-section">
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2">
                      <li><a href="#" className="text-sm text-[hsl(var(--foreground))] text-opacity-70 hover:text-[hsl(var(--primary))]">Privacy Policy</a></li>
                      <li><a href="#" className="text-sm text-[hsl(var(--foreground))] text-opacity-70 hover:text-[hsl(var(--primary))]">Terms of Service</a></li>
                  </ul>
              </div>
              <div className="footer-section">
                  <h4 className="font-semibold mb-4">Contact</h4>
                   <ul className="space-y-2 text-sm text-[hsl(var(--foreground))] text-opacity-70">
                      <li>Father Dust</li>
                      <li>Email: aiautoally@gmail.com</li>
                      <li>Phone: (828) 471-0032</li>
                  </ul>
              </div>
          </div>
          <div className="footer-bottom max-w-7xl mx-auto mt-8 pt-6 border-t border-[hsl(var(--border))] text-center text-xs text-[hsl(var(--foreground))] text-opacity-60">
              <p>&copy; {new Date().getFullYear()} Father Dust's Thinkery. All rights reserved.</p>
          </div>
      </footer>

      <CartSidebar 
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
      
      <CheckoutModal
        isOpen={isCheckoutOpen}
        cart={cart}
        onClose={() => setIsCheckoutOpen(false)}
        onPurchaseComplete={handlePurchaseComplete}
      />
      
      {selectedProduct && (
        <ProductDetailModal
          isOpen={isDetailsModalOpen}
          product={selectedProduct}
          onClose={() => setIsDetailsModalOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}

    </div>
  );
};

export default App;